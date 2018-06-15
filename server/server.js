import SourceMapSupport from 'source-map-support';
import 'babel-polyfill';

import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import Issue from './issue';

SourceMapSupport.install();

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware'); // eslint-disable-line

  const config = require('../webpack.config.js');
  config.entry.app.push('webpack-hot-middleware/client', 'webpack/hot/dev-server');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const bundler = webpack(config);
  app.use(webpackDevMiddleware(bundler, { noInfo: true }));
  app.use(webpackHotMiddleware(bundler, { log: console.log }));
}

app.get('/api/issues', (req, res) => {
  db.collection('issues').find().toArray().then((issues) => {
    const metadata = { total_count: issues.length };
    res.json({ _metadata: metadata, records: issues });
  })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

app.post('/api/issues', (req, res) => {
  let db;
  const newIssue = req.body;
  newIssue.created = new Date();
  if (!newIssue.status) { newIssue.status = 'New'; }

  const err = Issue.validateIssue(newIssue);
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` });
    return;
  }

  db.collection('issues').insertOne(newIssue).then(result =>
    db.collection('issues').findOne({ _id: result.insertedId }).then((newIssue) => {
      res.json(newIssue);
    }).catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }));
});
MongoClient.connect('mongodb://localhost/issuetracker').then(() => {
  app.listen(3000, () => {
    console.log('App started on port 3000');
  });
}).catch((error) => {
  console.log('ERROR:', error);
});

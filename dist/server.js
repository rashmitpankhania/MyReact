

const _sourceMapSupport = require('source-map-support');

const _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

require('babel-polyfill');

const _path = require('path');

const _path2 = _interopRequireDefault(_path);

const _express = require('express');

const _express2 = _interopRequireDefault(_express);

const _bodyParser = require('body-parser');

const _bodyParser2 = _interopRequireDefault(_bodyParser);

const _mongodb = require('mongodb');

const _issue = require('./issue.js');

const _issue2 = _interopRequireDefault(_issue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();

const app = (0, _express2.default)();
app.use(_express2.default.static('static'));
app.use(_bodyParser2.default.json());

if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

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
            console.log(error);
            res.status(500).json({ message: `Internal Server Error: ${error}` });
        });
});

app.post('/api/issues', (req, res) => {
    const newIssue = req.body;
    newIssue.created = new Date();
    if (!newIssue.status) newIssue.status = 'New';

    const err = _issue2.default.validateIssue(newIssue);
    if (err) {
        res.status(422).json({ message: `Invalid request: ${err}` });
        return;
    }

    db.collection('issues').insertOne(newIssue).then(result => db.collection('issues').findOne({ _id: result.insertedId }).then((newIssue) => {
        res.json(newIssue);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
    }));
});
var db = void 0;
_mongodb.MongoClient.connect('mongodb://localhost/issuetracker').then((connection) => {
    db = connection;
    app.listen(3000, () => {
        console.log('App started on port 3000');
    });
}).catch((error) => {
    console.log('ERROR:', error);
});
// # sourceMappingURL=server.js.map

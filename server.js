const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('static'));
app.use(bodyParser.json());

const issues = [
    {
        id: 1, status: 'Open', owner: 'Ravan',
        created: new Date('2016-08-15'), effort: 5, completionDate: undefined,
        title: 'Error in console when clicking Add',
    },
    {
        id: 2, status: 'Assigned', owner: 'Eddie',
        created: new Date('2016-08-16'), effort: 14, completionDate: new Date('2016-08-30'),
        title: 'Missing bottom border on panel',
    },
];

app.get('/api/issues', function(req, res){
    const metadata = {tottal_count: issues.length};
    res.jsonp({_metadata:metadata, records: issues});
});

app.post('/api/issues', function(req,res){
    newIssue = req.body;
    newIssue.id = issues.length + 1;
    if(!newIssue.status){
        newIssue.status = 'New';
    }
    newIssue.created = new Date();
    issues.push(newIssue)
    res.json(newIssue);
})

app.listen(3000, function(){
    console.log('App has been running on 3000.')
});
var express = require('express');
var app = express();

app.use(express.static('static'));
app.listen(3000, function(){
    console.log('App has been running on 3000.')
});
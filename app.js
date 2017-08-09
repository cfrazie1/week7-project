const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const routes = require('./routes/routes.js');

app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressValidator());

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html");
})

// put routes here
app.use(routes);

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});

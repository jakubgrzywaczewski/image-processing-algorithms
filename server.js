const express = require("express");
const app = express();
const path = require("path");
let port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));   
});

app.listen(port);

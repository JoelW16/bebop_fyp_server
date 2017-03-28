// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var googleMapsClient = require('@google/maps').createClient({
    key: 'INSERT KEY'
});

mongoose.connect('mongodb://localhost/rest_test');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public/javascript'));
app.use(express.static(__dirname + '/public/stylesheets'));
app.use(express.static(__dirname + '/public/assets'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    io.emit('connected');
});

app.use('/api', require('./routes/api'));

//404 Page
app.get('*', function(req, res){
    res.sendFile(__dirname + '/404.html');
});

// Send current time to all connected clients
module.exports.updateDrone = function(json) {
    io.emit('updateDrone', json);
};


module.exports.emgLanding = function(json) {
    io.emit('emgLanding', json);
};

module.exports.takeoff = function(json) {
    io.emit('takeoff', json);
};

module.exports.landing = function(json) {
    io.emit('landing', json);
};

module.exports.updateMyo = function(json) {
    io.emit('updateMyo', json);
};

module.exports.updateDronePos = function(json) {
    io.emit('updateDronePos', json);
};

module.exports.updateAndroid = function(json) {
    io.emit('updateAndroid', json);
};
server.listen(3000);
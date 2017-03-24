// Dependencies
var express = require('express');
var router = express.Router();
var googleMapsClient = require('@google/maps').createClient({key: 'AIzaSyDJw0VMi-JEgET_xZIDp1hD7vs85sEWzAg'});
var polyline = require('@mapbox/polyline');

// Models
var Drone = require('../models/drone');
var Myo = require('../models/myo');
var Android = require('../models/android');
var Tour = require('../models/tour');
var main = require('../app');

// Routes
Drone.methods(['get', 'put']);
Myo.methods(['get', 'put']);
Android.methods(['get', 'put']);
Tour.methods(['get', 'put']);




//Drone Updates
Android.before('put', function(req, res, next) {
    // googleMapsClient.directions({
    //     origin: [req.body.latitude, req.body.longitude],
    //     destination: "50.865301, -0.089335",
    //     mode: 'walking'
    // }, function(err, response) {
    //     if (!err) {
    //         var poly =response.json.routes[0].overview_polyline;
    //         console.log(polyline.decode(poly.points));
    //     }
    // });

    console.log(req.body);
    next();
});

//Drone Updates
Drone.after('put', function(req, res, next) {
    if(res.locals.status_code == 200){
        main.updateDrone(req.body);
    }

    next();
});

//Myo Updates
Myo.after('put', function(req, res, next) {
    if(res.locals.status_code == 200){
        main.updateMyo(req.body);
    }
    next();
});

//Android Updates
Android.after('put', function(req, res, next) {
    if(res.locals.status_code == 200){
        main.updateAndroid(req.body);
    }

    if(req.body.connected !== undefined){
        res.locals.bundle.connected = req.body.connected;
    }
    next();
});

//URL
Drone.register(router, '/droneUpdateStatus');
Myo.register(router, '/myoUpdateStatus');
Android.register(router, '/androidUpdateStatus');
Tour.register(router, '/tourUpdatePoints');

// Return router
module.exports = router;

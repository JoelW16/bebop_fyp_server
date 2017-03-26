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
var pos = null;
var current_pos = "";

// Routes
Drone.methods(['get', 'put']);
Myo.methods(['get', 'put']);
Android.methods(['get', 'put']);
Tour.methods(['get', 'put']);


function checkPos(androidReq){
    console.log("CHECK");
    if(pos != null) {
        var point = null;

        var dist = null;

        Tour.find({_id: "58d26bd01c539c795303bb2f"}, function (err, docs) {
            if(pos < docs[0].tour.length) {
                if (!err) {
                    point = docs[0].tour[pos];
                    if (point != null) {
                        dist = getDistanceFromLatLonInKm(point.latitude, point.longitude, androidReq.latitude, androidReq.longitude) * 1000;

                    }
                }
                console.log("Distance: " + dist);
                if (dist < 5) {
                    console.log(point.name);
                    pos++;
                }
                current_pos = docs[0].tour[pos-1].name;
            }
        });

    }

}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}



//Drone Updates
Android.before('put', function(req, res, next) {

    //res.locals.bundle.title = pos;

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

    if(req.body.connected !== undefined){
        if(JSON.parse(req.body.connected)){
            pos = 0;
            res.locals.bundle.pos = "Find Start";
        }else{
            current_pos = "";
            pos = null;
        }
    }else{
        checkPos(req.body);
        console.log(res.locals.bundle.pos);
    }
    console.log("Current pos: " + current_pos);


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

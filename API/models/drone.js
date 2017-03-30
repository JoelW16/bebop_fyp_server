/**
 * @file Something
 * @author Joel Walker
 */
// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var droneSchema = new mongoose.Schema({
    battery: Number,
    connected: Boolean,
    longitude: Number,
    latitude: Number,
    Altitude: Number
});

// Return model
module.exports = restful.model('Drone', droneSchema);


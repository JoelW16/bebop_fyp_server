/**
 * @file Something
 * @author Joel Walker
 */
// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

var myoSchema = new mongoose.Schema({
    longitude: Number,
    latitude: Number,
    accuracy: Number,
    connected: Boolean,
    command: Number

});

module.exports = restful.model('Android', myoSchema);
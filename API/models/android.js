/**
 * Created by jw479 on 02/03/2017.
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
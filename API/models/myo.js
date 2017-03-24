/**
 * Created by jw479 on 02/03/2017.
 */
// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

var myoSchema = new mongoose.Schema({
    pose: Number,
    connected: Boolean
});

module.exports = restful.model('Myo', myoSchema);
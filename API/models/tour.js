/**
 * @file Something
 * @author Joel Walker
 */
// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

var tourSchema = new mongoose.Schema({
    tour:[
        {
            locationRef: Number,
            name: String,
            info: String,
            poi: Boolean,
            longitude: Number,
            latitude: Number,
            accuracy: Number
        }
    ]
});

module.exports = restful.model('Tour', tourSchema);
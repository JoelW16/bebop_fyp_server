/**
 * Created by jw479 on 02/03/2017.
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
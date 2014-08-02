var mongoose = require('./mongoose.js');

var Models = function(){
    var PointSchema = new mongoose.Schema({
        id      : String,
        imei    : String,

        inp     : Array,

        gsm     : Number,
        hdop    : Number,

        bat     : Number,
        pow     : Number,

        tmp     : Number,

        alt     : Number,
        hdg     : Number,
        spd     : Number,

        date    : Date,
        lat     : Number,
        lon     : Number,

        loc: {
            type        : { type: String },
            coordinates : { type: [ Number ] }
        },

        device: {
            type: Schema.ObjectId,
            ref: 'Device',
            index: true
        }
    }, {
        collection: "points"
    });

    this.Point = mongoose.model('Point', PointSchema);


    var GeoZoneSchema = new mongoose.Schema({
        name: String,
        user: {
            type: Schema.ObjectId,
            ref: 'User',
            index: true
        },
        loc: {
            type        : { type: String },
            coordinates : { type: Array }
        }
    }, {
        collection: "geozones"
    });

    GeoZoneSchema.index({
        loc: "2dsphere"
    });

    this.GeoZone = mongoose.model('GeoZone', GeoZoneSchema);


    var Device = new mongoose.Schema({
        name: String,
        id: String,
        imei: String,
        user: {
            type: Schema.ObjectId,
            ref: 'User',
            index: true
        },
        current_geozone: String
    }, {
        collection: "devices"
    });

    this.Device = mongoose.model('Device', GeoZoneSchema);


    var User = new mongoose.Schema({
        name: String
    }, {
        collection: "users"
    });

    this.User = mongoose.model('User', GeoZoneSchema);
};

module.exports = new Models();
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
            type: mongoose.Schema.ObjectId,
            ref: 'Device',
            index: true
        },

        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            index: false
        }
    }, {
        collection: "points"
    });

    this.Point = mongoose.model('Point', PointSchema);


    var GeoZoneSchema = new mongoose.Schema({
        name: String,
        active: {
            type: Boolean,
            index: true,
            default: false
        },
        geozone: {
            type: mongoose.Schema.ObjectId,
            ref: 'GeoZone',
            index: false
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            index: true
        },
        loc: {
            type        : {
                type: String
            },
            coordinates : {
                type: Array
            }
        },
        notify: {
            sms: {
                type: Boolean,
                default: false
            },
            email: {
                type: Boolean,
                default: false
            }
        }
    }, {
        collection: "geozones"
    });

    GeoZoneSchema.index({
        loc: "2dsphere"
    });

    this.GeoZone = mongoose.model('GeoZone', GeoZoneSchema);


    var DeviceSchema = new mongoose.Schema({
        name: String,
        id: String,
        imei: String,
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            index: true
        },
        geozone: String,
        notify: {
            sms: {
                type: Boolean,
                default: false
            },
            email: {
                type: Boolean,
                default: false
            }
        }
    }, {
        collection: "devices"
    });

    this.Device = mongoose.model('Device', DeviceSchema);


    var UserSchema = new mongoose.Schema({
        name: String,
		email: String,
        notify: {
            sms: {
                type: Boolean,
                default: false
            },
            email: {
                type: Boolean,
                default: false
            }
        },
        phone: {
            active: {
                type: Boolean,
                default: false
            },
            number: {
                type: Number
            },
            code: {
                type: String
            }
        }
    }, {
        collection: "users"
    });
	
	UserSchema.path('email').validate(function (email) {
	   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	   return emailRegex.test(email.text);
	}, 'The e-mail field cannot be empty.')

    this.User = mongoose.model('User', UserSchema);
};

module.exports = new Models();
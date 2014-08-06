var models = require('./models.js');

/**
 *
 * @constructor
 */
var Point = function (user_id) {
    var _this = this;

    this.addPoint = function(device_id, data, done){
        var data = {
            id          : data.id,
            imei        : data.imei,
            inp         : data.inp,

            gsm         : data.gsm,
            hdop        : data.hdop,

            bat         : data.bat,
            pow         : data.pow,

            tmp         : data.tmp,

            alt         : data.alt,
            hdg         : data.hdg,
            spd         : data.spd,

            date        : data.date,
            sat         : data.sat,

            loc         : {
                type: 'Point',
                coordinates: [
                    data.lat,
                    data.lon
                ]
            },

            device: device_id
        };

        var point = new models.Point(data);

        point.save(function (err) {
            if (err) {
                console.log('Model Point error: model error', err);
                return done(false);
            }

            return done(true);
        });
    };

    this.getLatestPoint = function(device_data, done){
        models.Point.findOne({device: device_data}, function(err, data){
            if(err){
                return done(false);
                console.log('Model Point error: model error', err);
            }

            return done(data);
        });
    };
};

module.exports = Point;
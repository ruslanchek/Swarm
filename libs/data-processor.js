var _ = require('lodash'),
	geo = require('./geodata.js'),
    models = require('./models.js');

var DataProcessor = function(){
    this.process = function(raw){
        var data = {
            id          : raw.id,
            imei        : raw.imei,
            inp         : raw.inp,

            gsm         : raw.gsm,
            hdop        : raw.hdop,

            bat         : raw.bat,
            pow         : raw.pow,

            tmp         : raw.tmp,

            alt         : raw.alt,
            hdg         : raw.hdg,
            spd         : raw.spd,

            date        : raw.date,
            sat         : raw.sat,

            loc         : {
                type: 'Point',
                coordinates: [
                    raw.lat,
                    raw.lon
                ]
            }
        };

        var point = new models.Point(data);

        point.save(function (err) {
            if (err) {
                console.log('Data processor: model error', err);
            }
        });
    };
};

module.exports = new DataProcessor();
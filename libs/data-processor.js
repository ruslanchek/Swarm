var _ = require('lodash'),
	geo = require('./geodata.js'),
    models = require('./models.js');

var DataProcessor = function(){

    /*
    var format = {
        id          : params.dev_id,
        imei        : params.imei,
        inp         : params.device_params.inputs,

        gsm         : params.device_params.dev_status.gsm_signal_level,
        hdop        : params.device_params.hdop,

        bat         : params.device_params.power_bat,
        pow         : params.device_params.power_inp,

        tmp         : params.device_params.dev_temp,

        alt         : params.telemetry.altitude,
        hdg         : params.telemetry.gps.heading,
        spd         : params.telemetry.gps.speed,

        date        : params.telemetry.datetime,
        lon         : params.telemetry.lon,
        lat         : params.telemetry.lat,

        sat         : params.telemetry.sat_count
    };
    */

    this.process = function(data){
        var point = new models.Point(data);

        point.save(function (err) {
            if (err) {
                console.log('Data processor: model error', err);
            }
        });
    };
};

module.exports = new DataProcessor();

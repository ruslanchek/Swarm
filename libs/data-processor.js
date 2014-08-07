var _ = require('lodash'),
    geodata = require('./geodata.js'),

    geozone = require('./geozone.js'),
    device = require('./device.js'),
    point = require('./point.js'),
    user = require('./user.js'),

    Notify = require('./notify.js');    

var DataProcessor = function () {
    var _this = this;

    this.socket = null;
    this.notify = null;
    this.onSuccess = function () {};

    function collectData(point_data, done) {
        device.getByIdAndIMEI(point_data.id, point_data.imei, function (device_data) {
            if (device_data) {
                user.getById(device_data.user, function (user_data) {
                    if (user_data) {
                        point.getLatestPoint(device_data, user_data._id, function (latest_point_data) {
                            done({
                                point_data: point_data,
                                latest_point_data: latest_point_data,
                                user_data: user_data,
                                device_data: device_data
                            });
                        });
                    } else {
                        console.log('Data processor: no user data');
                        return done(false);
                    }
                });
            } else {
                console.log('Data processor: no device data');
                return done(false);
            }
        });
    }

    function pointsFilter(point_data, latest_point_data) {
        return true;
    }

    function savePoint(point_data, device_id, user_id) {
        point.addPoint(point_data, device_id, user_id, function (success) {
            if (success) {
                _this.onSuccess();
            } else {
                console.log('Data processor: point filtered');
                _this.socket.destroy();
            }
        });
    }

    function processGeozones(point_data, device_data, user_id) {
        function exit(geozone_data, done){
            console.log(device_data.name + ' exiting geozone ' + geozone_data.name);
            if(done){done()};
        }

        function enter(geozone_data, done){
            console.log(device_data.name + ' entering geozone ' + geozone_data.name);
            if(done){done()};
        }

        function updateDeviceGeozone(update_geozone_id){
            device.update(device_data._id, user_id, { geozone: update_geozone_id }, function(data){
                console.log('Data processor: device geozone updatated');
            });
        }

        geozone.getById(device_data.geozone, user_id, function(latest_geozone){
            geozone.checkPoint([point_data.lat, point_data.lon], user_id, function(new_geozone){
                if(latest_geozone && new_geozone){
                    if(latest_geozone._id.toString() != new_geozone._id.toString()){ // Enter new & Exit old
                        exit(latest_geozone, function(){
                            enter(new_geozone);
                        });
                        updateDeviceGeozone(new_geozone._id);
                    }
                }

                if(!latest_geozone && new_geozone){ // Enter new
                    enter(new_geozone);
                    updateDeviceGeozone(new_geozone._id);
                }

                if(latest_geozone && !new_geozone){ // Exit old
                    exit(latest_geozone);
                    updateDeviceGeozone(null);
                }
            });
        });
    }

    this.process = function (point_data, socket, onSuccess) {
        this.onSuccess = onSuccess;
        this.socket = socket;

        collectData(point_data, function (data) {
            if (data) {
                this.notify = new Notify(data.user_data);

                if (pointsFilter(data.point_data, data.latest_point_data)) {
                    savePoint(data.point_data, data.device_data._id, data.user_data._id);
                    processGeozones(data.point_data, data.device_data, data.user_data._id);
                } else {
                    console.log('Data processor: point filtered');
                    socket.destroy();
                }
            } else {
                console.log('Data processor: no data collected');
                socket.destroy();
            }
        });
    }
};

module.exports = new DataProcessor();
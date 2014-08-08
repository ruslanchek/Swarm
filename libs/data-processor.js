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

    this.process = function (point_data, socket, onSuccess) {
        this.onSuccess = onSuccess;
        this.socket = socket;

        collectData(point_data, function (data) {
            if (data) {
                _this.notify = new Notify(data.user_data, data.device_data);

                if (pointsFilter(data.point_data, data.latest_point_data)) {
                    savePoint(data.point_data, data.device_data._id, data.user_data._id);
					
                    geozone.processGeozones(
						data.point_data, 
						data.device_data, 
						data.user_data, 
						function(geozone_data){
							if(geozone_data.notify && geozone_data.notify.sms === true || geozone_data.notify.email === true){
                    			_this.notify.send(
									data.device_data.name + ' enters geozone ' + geozone_data.name,
									data.device_data.name + ' enters geozone ' + geozone_data.name,
									'geo'
								);
							}
	                    }, 
						function(geozone_data){
							if(geozone_data.notify && geozone_data.notify.sms === true || geozone_data.notify.email === true){
	                    		_this.notify.send(
									data.device_data.name + ' exits geozone ' + geozone_data.name,
									data.device_data.name + ' exits geozone ' + geozone_data.name,
									'geo'
								);
							}
	                    },
						function(geozone_data){
				            device.update(data.device_data._id, data.user_data._id, { geozone: geozone_data._id }, function(data){
				                console.log('Data processor: device geozone updatated');
				            });
						}
					);
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
var _ = require('lodash'),
	geo = require('./geodata.js'),
    geozone = require('./geozone.js'),
    device = require('./device.js'),
    point = require('./point.js'),
    user = require('./user.js');

var DataProcessor = function(){
    var _this = this;

    this.socket = null;

    //Algo => Data => Get device ID & IMEI => Get device by ID & IMEI => Get user by dev ID => Do Point filter Algo => Save point data => Get device GZ => Process GZ Algo => Save GZ data => Send confirm To User
    this.onSuccess = function(){

    };

    function collectData(point_data, done){
        device.getByIdAndIMEI(point_data.id, point_data.imei, function(device_data){
            if(device_data){
                user.getById(device_data.user, function(user_data){
                    if(user_data){
                        point.getLatestPoint(device_data, user_data._id, function(latest_point_data){
                            geozone.getById(device_data.geozone, user_data._id, function(latest_geozone_data){
                                done({
                                    point_data: point_data,
                                    latest_point_data: latest_point_data,
                                    latest_geozone_data: latest_geozone_data,
                                    user_data: user_data,
                                    device_data: device_data
                                });
                            });
                        });
                    }else{
                        console.log('Data processor: no user data');
                        return done(false);
                    }
                });
            }else{
                console.log('Data processor: no device data');
                return done(false);
            }
        });
    }

    function pointsFilter(point_data, latest_point_data){
        return true;
    }

    function savePoint(point_data, device_id, user_id){
        point.addPoint(point_data, device_id, user_id, function(success){
            if(success){
                _this.onSuccess();
            }else{
                console.log('Data processor: point filtered');
                _this.socket.destroy();
            }
        });
    }

    this.process = function(point_data, socket, onSuccess){
        this.onSuccess = onSuccess;
        this.socket = socket;

        collectData(point_data, function(data){
            if(data){
                if(pointsFilter(data.point_data, data.latest_point_data)){
                    savePoint(data.point_data, data.device_data._id, data.user_data.id)
                }else{
                    console.log('Data processor: point filtered');
                    socket.destroy();
                }
            }else{
                console.log('Data processor: no data collected');
                socket.destroy();
            }
        });
    }
};

module.exports = new DataProcessor();
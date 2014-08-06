var _ = require('lodash'),
	geo = require('./geodata.js'),
    geozone = require('./geozone.js'),
    device = require('./device.js'),
    user = require('./user.js');

var DataProcessor = function(){
    //Algo => Data => Get device ID & IMEI => Get device by ID & IMEI => Get user by dev ID => Do Point filter Algo => Save point data => Get device GZ => Process GZ Algo => Save GZ data => Send confirm To User

    function collectData(data, done){
        device.getByIdAndIMEI(data.id, data.imei, function(device_data){
            if(device_data){
                user.getById(device_data.user, function(user_data){
                    if(user_data){
                        done({
                            user: user_data,
                            device: device_data
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

    this.process = function(data, socket){
        collectData(data, function(data){
            if(data){
                console.log(data);
            }else{
                socket.destroy();
            }
        });
    }
};

module.exports = new DataProcessor();
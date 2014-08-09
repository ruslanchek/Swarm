var models = require('./models.js');

/**
 *
 * @constructor
 */
var Device = function () {
    this.getByIdAndIMEI = function(id, imei, done){
		if (!id.match(/^[0-9a-fA-F]{24}$/)) {
			return done(false);
		}
		
        models.Device.findOne({id: id, imei: imei}, function(err, data){
            if(err){
                console.log('Model Device error: model error', err);
                return done(false);
            }

            return done(data);
        });
    };

    this.update = function(device_id, user_id, data, done){
		if (!device_id.match(/^[0-9a-fA-F]{24}$/)) {
			return done(false);
		}
		
        models.Device.findOneAndUpdate({ _id: device_id, user: user_id }, data, function(err, data){
            if(err){
                console.log('Model Device error: model error', err);
                return done(false);
            }

            return done(data);
        });
    };
};

module.exports = new Device();
var models = require('./models.js');

/**
 *
 * @constructor
 */
var Device = function () {
    this.getByIdAndIMEI = function(id, imei, done){
        models.Device.findOne({id: id, imei: imei}, function(err, data){
            if(err){
                console.log('Model Device error: model error', err);
                return done(false);
            }

            return done(data);
        });
    };
};

module.exports = new Device();
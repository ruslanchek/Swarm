var models = require('./models.js');

/**
 *
 * @constructor
 */
var Device = function (user_id) {
    var _this = this;

    this.getByIdAndIMEI = function(id, imei, done){
        models.user.find({id: id, imei: imei}, function(err, data){
            if(err){
                return done(false);
            }

            return done(data);
        });
    };
};

module.exports = Device;
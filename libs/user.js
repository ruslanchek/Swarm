var models = require('./models.js');

/**
 *
 * @constructor
 */
var User = function () {
    var _this = this;

    this.getUserById = function(id, done){
        models.user.find({_id: id}, function(err, data){
            if(err){
                return done(false);
            }

            return done(data);
        });
    };
};

module.exports = User;
var models = require('./models.js');

/**
 *
 * @constructor
 */
var User = function () {
    this.getById = function(id, done){
        models.User.findOne({ _id: id }, function(err, data){
            if(err){
                console.log('Model User error: model error', err);
                return done(false);
            }

            return done(data);
        });
    };
};

module.exports = new User();
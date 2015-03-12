var mongoose = require('mongoose');

/**
 *
 * @returns {*|exports}
 * @constructor
 */
var MongooseConnect = function () {
    var _this = this,
        options = {
            user: 'admin',
            password: '',
            server: '',
            port: '',
            db: '',
            connection_options: {
                server: {
                    socketOptions: {
                        keepAlive: 1
                    }
                }
            }
        };

    var connect = function () {
        mongoose.connect(
            'mongodb://' +
            options.user + ':' +
            options.password + '@' +
            options.server + ':' +
            options.port + '/' +
            options.db,
            options.connection_options
        )
    };

    connect();

    mongoose.connection.on('error', function (err) {
        console.log('Mongoose connection error', err);
    });

    mongoose.connection.on('disconnected', function () {
        connect();
    });

    return mongoose;
};

module.exports = new MongooseConnect();

var mongoose = require('mongoose');

/**
 *
 * @returns {*|exports}
 * @constructor
 */
var MongooseConnect = function() {
    var _this = this,
        options = {
            user: 'admin',
            password: 'lordaeron',
            server: 'kahana.mongohq.com',
            port: '10032',
            db: 'cartrek-swarm',
            connection_options: {
                server: {
                    socketOptions: {
                        keepAlive: 1
                    }
                }
            }
        };

    this.connect = function () {
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

    this.connect();

    mongoose.connection.on('error', function (err) {
        console.log('Mongoose connection error', err);
    });

    mongoose.connection.on('disconnected', function () {
        _this.connect();
    });

    return mongoose;
};

module.exports = new MongooseConnect();
var net = require('net'),
    _ = require('lodash');

/**
 * @returns {*|exports}
 * @constructor
 */
var Server = function () {
    var _this = this,
        options = {
            port: 10000,
            host: '127.0.0.1',
            max_data_length: 4096,
            socket_timeout: 30000
        },
        server = null,
        connections = [],
        last_data = null;

    this.onServerStartListening = function () {
        
    };

    this.onEndConnection = function () {

    };

    this.onDataRecieved = function (data, socket) {

    };

    this.clearConnection = function (socket_name, silent) {
        _.remove(connections, function (item) {
            if (silent === true) {
                console.log('Server: socket ' + socket_name + ' is deleted');
            }
            return item.name == socket_name;
        });
    };

    this.createServer = function () {
        server = net.createServer(function (socket) {
            socket.name = _.uniqueId('s_');

            console.log('Server: client ' + socket.name + ' connected');

            socket.setTimeout(options.socket_timeout, function () {
                console.log('Server: socket is timed out');
                socket.destroy();
            });

            socket.on('end', function () {
                console.log('Server: client ' + socket.name + ' disconnected');
                _this.onEndConnection();
            });

            socket.on('data', function (data) {
                console.log('Server: data from client ' + socket.name + ' recieved', data);

                if (data.length < options.max_data_length) {
                    if (data != last_data) {
                        last_data = data;
                    } else {
                        console.log('Same packet as a previous, dropped');
                        return false;
                    }

                    _this.onDataRecieved(data.toString('hex'), data, socket);
                } else {
                    console.log('Data is bigger than ' + options.max_data_length + ' bytes');
                }
            });

            socket.on('timeout', function () {
                console.log('Server: client ' + socket.name + ' timed out');
                socket.destroy();
                _this.clearConnection(socket.name);
            });

            socket.on('close', function () {
                console.log('Server: client ' + socket.name + ' dropped');
                socket.destroy();
                _this.clearConnection(socket.name);
            });

            socket.on('error', function (error) {
                console.log('Server: client ' + socket.name + ' socket error', error);
                socket.destroy();
                _this.clearConnection(socket.name, true);
            });

            connections.push(socket);
        });

        server.listen(options.port, options.host, function () {
            console.log('Server bound, ' + options.host + ':' + options.port);
            _this.onServerStartListening();
        });
    };

    this.createServer();

    return this;
};

module.exports = new Server();


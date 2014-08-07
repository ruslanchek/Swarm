var net = require('net'),
    _ = require('lodash'),
    protocol = require('./protocol.js'),
    dp = require('./data-processor.js');

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

    this.onDataRecieved = function (data, bytes, socket) {
        data = '01a9000338363832303430303135373734353004020020b2e5bd50300a90425103b8533e02330000580634a5003508400033410000429f0f4313445da227164508004600e0500000510000520000530000707f809000000000c000000000c100000000c200000000c300000000c400c500c600c700c800c900ca00cb00d4c4f00000d500d60000d70000d80000d90000da0000db00000000dc00000000dd00000000de00000000df00000000d7f1';
        //data = '013c800338363832303430303135373734353004020020561e9251300a3cfd4f03245f4202330000980c34ae003509400122411b2e42490f432f44fa15a8132449';

        var proto = new protocol(data, bytes, {
            onProtocolUndefined: function(){
                socket.destroy();
            },

            onClientSayByeBye: function(){
                socket.write('Bye-bye!\n');
                socket.destroy();
            }
        });

        if(proto.name == 'galileo'){
            var plugin = require('../plugins/galileo.js');

            var galileo = new plugin(data, {
                onEchoNeeded: function(data, encoding){
                    socket.write(data, encoding);
                },

                onComplete: function(data){
                    dp.process(data, socket, function(){
                        galileo.sendSuccesResponse();
                    });
                }
            });

            galileo.process();
        }
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

module.exports = Server;


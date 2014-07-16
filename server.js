var net = require('net');

/**
 * @returns {*|exports}
 * @constructor
 */
var Server = function(){
    var _this = this,
        options = {
            port: 10000
        },
        server = null,
        connection = null;

    this.onServerStartListening = function(){

    };

    this.onEndConnection = function(connection){

    };

    this.onDataRecieved = function(data, connection){

    };

    this.sendData = function(data){
        if(connection){
            connection.write(data);
        }
    };

    this.dropConnection = function(data){
        if(connection) {
            if(data){
                this.sendData(data);
            }

            connection.destroy();
        }
    };

    this.createServer = function(){
        server = net.createServer(function(c) {
            connection = c;

            connection.on('end', function() {
                console.log('Server: client disconnected');
                _this.onEndConnection();
            });

            connection.on('data', function(data){
                console.log('Server: data recieved', data);
                _this.onDataRecieved(data, connection);
            });
        });

        server.listen(options.port, function() {
            console.log('Server bound, port: ' + options.port);
            _this.onServerStartListening();
        });
    };

    this.createServer();

    return this;
};

module.exports = new Server();


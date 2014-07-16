process.env.TZ = 'Europe/Moscow';

var mongoose = require('./libs/mongoose.js'),
    server = require('./libs/server.js'),
    gallileo = require('./plugins/gallileo.js');

server.onDataRecieved = function(raw_data, socket){
    var data = raw_data.toString('hex');

    var protocol = new gallileo(data, {
        onEchoNeeded: function(data, encoding){
            socket.write(data, encoding);
        },

        onComplete: function(data){
            console.log(data);
        }
    });

    protocol.process();
};
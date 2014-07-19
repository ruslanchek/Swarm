process.env.TZ = 'Europe/Moscow';

var mongoose = require('./libs/mongoose.js'),
    server = require('./libs/server.js'),
    protocol = require('./libs/protocol.js'),
    data_processor = require('./libs/data-processor.js');

server.onDataRecieved = function(data, bytes, socket){
    var dp = new data_processor(mongoose);
    
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
        var plugin = require('./plugins/galileo.js');

        var galileo = new plugin(data, {
            onEchoNeeded: function(data, encoding){
                socket.write(data, encoding);
            },

            onComplete: function(data){
                dp.process(data);
            }
        });

        galileo.process();
    }
};
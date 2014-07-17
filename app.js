process.env.TZ = 'Europe/Moscow';

var mongoose = require('./libs/mongoose.js'),
    server = require('./libs/server.js'),
    protocol = require('./libs/protocol.js');

server.onDataRecieved = function(data, bytes, socket){
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
                console.log(data);

                var Point = mongoose.model('Point', { data: Object });

                var kitty = new Point({data: data});

                kitty.save(function (err) {
                    if (err) // ...
                        console.log('meow');
                });
            }
        });

        galileo.process();
    }
};
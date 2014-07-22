process.env.TZ = 'Europe/Moscow';

var server = require('./libs/server.js'),
    protocol = require('./libs/protocol.js'),
    dp = require('./libs/data-processor.js');

server.onDataRecieved = function(data, bytes, socket){
    data = '01a9000338363832303430303135373734353004020020b2e5bd50300a90425103b8533e02330000580634a5003508400033410000429f0f4313445da227164508004600e0500000510000520000530000707f809000000000c000000000c100000000c200000000c300000000c400c500c600c700c800c900ca00cb00d4c4f00000d500d60000d70000d80000d90000da0000db00000000dc00000000dd00000000de00000000df00000000d7f1';
    
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
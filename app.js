var mongoose = require('./mongoose.js'),
    server = require('./server.js');

server.onDataRecieved = function(data){
    console.log(data);

    setTimeout(function(){
       server.dropConnection('sss\n');
    }, 1000);
};
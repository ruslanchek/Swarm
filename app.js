process.env.TZ = 'Europe/Moscow';

var Server = require('./libs/server.js');
    gz = require('./libs/geozones.js');

gz.checkPoint([
    55.758904,
    37.618527
], function(data){
    console.log(data)
});

//var server = new Server();
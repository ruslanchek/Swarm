process.env.TZ = 'Europe/Moscow';

var Server = require('./libs/server.js');
var gz = require('./libs/geozone.js');
var dev = require('./libs/device.js');
var usr = require('./libs/user.js');

/*
usr.getById('53dfe91d47c29cea8d0006dd', function(data){
    console.log(data)
});



dev.getByIdAndIMEI('2', '868204001577450', function(data){
    console.log(data)
});



gz.checkPoint([
    55.758904,
    37.618527
], function(data){
    console.log(data)
});
 */

var server = new Server();
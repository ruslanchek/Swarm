process.env.TZ = 'Europe/Moscow';

var Server = require('./libs/server.js');
var gz = require('./libs/geozone.js');
var dev = require('./libs/device.js');
var usr = require('./libs/user.js');

var server = new Server();

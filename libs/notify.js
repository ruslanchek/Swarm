var sms = require('./sms.js');

/**
 *
 * @constructor
 */
var Notify = function (user_data) {
	this.user_data = user_data;

	this.send = function(message){
        if(this.user_data.phone.active){
            sms.send(message, [this.user_data.phone.number]);
        }
    };
};

module.exports = Notify;

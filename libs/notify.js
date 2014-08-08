var sms = require('./sms.js'),
	mail = require('./mail.js');

/**
 *
 * @constructor
 */
var Notify = function (user_data, device_data) {
	this.user_data = user_data;
	this.device_data = device_data;

	this.send = function(subject, message, robot_name){
		if((this.user_data.notify && this.user_data.notify.sms === true) && (this.device_data.notify && this.device_data.notify.sms == true)){
	        if(this.user_data.phone && this.user_data.phone.active && this.user_data.phone.number){
	            sms.send(message + ' (' + new Date() + ')', [this.user_data.phone.number]);
	        }
		}
		
		if((this.user_data.notify && this.user_data.notify.email === true) && (this.device_data.notify && this.device_data.notify.email == true)){
			if(this.user_data.email){
				mail.send(this.user_data.email, subject, message, robot_name);
			}
		}
    };
};

module.exports = Notify;

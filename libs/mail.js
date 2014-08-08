var nodemailer = require('nodemailer');

/**
 *
 * @constructor
 */
var Mail = function () {
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: 'ruslanchek@gmail.com',
	        pass: 'gcwkjwxeebvpxwmj'
	    }
	});
	
    this.send = function (email, subject, message, robot_name) {
		if(!robot_name){
			robot_name = 'robot';
		}
		
		var mailOptions = {
		    from: 'Cartrek <' + robot_name + '@cartrek.ru>',
		    to: email + ', ' + email,
		    subject: subject,
		    html: message
		};
 
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        console.log('Mail: sending error', error);
		    }else{
		        console.log('Mail: Message sent', info.response);
		    }
		});
    }
};

module.exports = new Mail();

/**
 *
 * @constructor
 */
var Sms = function () {
    var options = {
        host			: 'littlesms.ru',
        port			: 443,
	    user            : 'ruslanchek@gmail.com',
	    api_key         : 'OaEwqp',
	    sender          : 'Cartrek',
        method			: 'GET'
    };
	
	this.sendSMS = function(message, phones, done) {
	    var https = require('https'),
	        recipients = '',
	        date = new Date();

	    message = message + ' (' + date + ')';

	    if (phones) {
	        recipients = phones.join(',');
			
			options.path =  '/api/message/send?user=' 	+ options.user +
					        '&apikey=' 					+ options.api_key +
					        '&recipients=' 				+ recipients +
					        '&message=' 				+ encodeURIComponent(message) +
					        '&sender=' 					+ options.sender;

	        var req = https.request(options, function (res) {
	            logger.debug({message: 'SMS sending request', data: {response: res.headers, options: options}});
				console.log('Sms: SMS sending error', e);

	            res.on('data', function (d) {
	                process.stdout.write(d);

	                logger.info({message: 'SMS sent!', data: {content: message, numbers: recipients, response: d}});
	                if(callback){ callback (pool_id) }
	            });

	            if(callback){ callback (pool_id) }
	        });

	        req.end();

	        req.on('error', function (e) {
	            console.log('Sms: SMS sending error', e);
	            if(done){ done(false); };
	        });
	    } else {
			console.log();
	        if(done){ done(false); };
	    }
	}

};

module.exports = new Sms();

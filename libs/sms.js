var https = require('https');

/**
 *
 * @constructor
 */
var Sms = function () {
    var options = {
        host			: 'littlesms.ru',
        port			: 443,
	    user            : '',
	    api_key         : '',
	    sender          : '',
        method			: 'GET'
    };
	
	this.send = function(message, phones, done) {
	    var recipients = '';

	    if (phones) {
	        recipients = phones.join(',');
			
			options.path = '/api/message/send?user=' 	+ options.user +
					       '&apikey=' 					+ options.api_key +
					       '&recipients=' 				+ recipients +
					       '&message=' 				    + encodeURIComponent(message) +
					       '&sender=' 					+ options.sender;

	        var req = https.request(options, function (res) {
	            res.on('data', function (data) {
                    console.log('Sms: Sms request sent', phones);
                    if(done){
                        done(true);
                    }
	            });
	        });

	        req.on('error', function (e) {
	            console.log('Sms: SMS sending error', e);
	            if(done){
                    done(false);
                }
	        });

                req.end();
	    } else {
	        console.log('Sms: no phones');
		if(done){
	            done(false);
	        }
	    }
	}
};

module.exports = new Sms();

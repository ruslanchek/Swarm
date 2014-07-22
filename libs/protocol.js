var _ = require('lodash');

var Protocol = function(data, bytes, options){
    var _this = this;

    this.options = {
        onClientSayByeBye: function(){

        },

        onProtocolUndefined: function(){

        }
    };

    _.extend(this.options, options);

    this.detect = function(){
        if (data.substr(0, 4) == '2424') {
            console.log('Protocol: start Meiligao');
            return 'meiligao';

        //Galileo
        } else if (data.substr(0, 2) == '01') {
            console.log('Protocol: start Galileo');
            return 'galileo';

        //Iphone [$iphone]
        } else if (data.substr(0, 14) == '246970686f6e65') {
            console.log('Protocol: start iPhone');
            return 'iphone';

        //Bye
        } else if (data == '6279650d0a' || data == '657869740d0a') {
            console.log('Protocol: Client say "Good bye!"');
            this.options.onClientSayByeBye();

        } else {
            console.log('Protocol: protocol is undefined');
            this.options.onProtocolUndefined();
        }
    };

    this.name = this.detect();
};

module.exports = Protocol;
var _ = require('lodash');

var Protocol = function(data, bytes, options){
    var _this = this;

    this.name = '';

    this.options = {
        onClientSayByeBye: function(){

        },

        onProtocolUndefined: function(){

        }
    };

    _.extend(this.options, options);

    var detect = function(){
        if (data.substr(0, 4) == '2424') {
            console.log('Protocol: start processing Meiligao');
            _this.name = 'meiligao';

        //Galileo
        } else if (data.substr(0, 2) == '01') {
            console.log({message: 'Start processing Galileo Protocol'});
            _this.name = 'galileo';

        //Iphone [$iphone]
        } else if (data.substr(0, 14) == '246970686f6e65') {
            console.log({message: 'Start processing iPhone Protocol'});
            _this.name = 'iphone';

        //Bye
        } else if (data == '6279650d0a' || data == '657869740d0a') {
            console.log('Protocol: Client say "Good bye!"');
            _this.options.onClientSayByeBye();

        } else {
            console.log('Protocol: protocol is undefined');
            _this.options.onProtocolUndefined();
        }
    };

    detect();
};

module.exports = Protocol;
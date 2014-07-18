var _ = require('lodash'),
	geodata = new require('./geodata.js')();

var DataProcessor = function(mongoose){
    var format = {
        
    };

    this.process = function(data){
        var Point = mongoose.model('Point', { data: Object });

        var kitty = new Point({data: data});

        kitty.save(function (err) {
            if (err) {
                console.log('Data processor: model error', err);
            }
        });
    };
};

module.exports = new DataProcessor();
var mongoose = require('./mongoose.js');

var Models = function(){
    this.Point = mongoose.model('Point', {
        data: Object
    });

    this.a = 1;
};

module.exports = new Models();
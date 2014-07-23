var mongoose = require('./mongoose.js');

var Models = function(){
    this.Point = mongoose.model('Point', {
        id          : String,
        imei        : String,
        inp         : Array,

        gsm         : Number,
        hdop        : Number,

        bat         : Number,
        pow         : Number,

        tmp         : Number,

        alt         : Number,
        hdg         : Number,
        spd         : Number,

        date        : Date,
        lat         : Number,
        lon         : Number,

        sat         : Number
    });

    this.a = 1;
};

module.exports = new Models();
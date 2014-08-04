var models = require('./models.js');

/**
 *
 * @constructor
 */
var GeoZones = function (user_id) {
    var _this = this;

    this.checkPoint = function(coords, done){
        models.GeoZone.find({
            loc: {
                type: 'Point',
                coordinates: coords
            }
        }, function(err, data){
            if(err){
                return done(false);
            }else{
                return done(data);
            }
        });
    };

/*
    var geoJsonPoly = {
        type: "Polygon",
        coordinates: [
            [
                [56.599321, 35.356716],
                [56.659875, 40.003933],
                [54.173627, 37.993435],
                [56.61144,  35.279812],
                [56.599321, 35.356716]
            ]
        ]
    };

    var d1 = new Date().getTime();

    models.Point.find({}).where('loc').within(geoJsonPoly).lean().exec(function (error, result) {
        var d2 = new Date().getTime();

        console.log((d2 - d1) / 1000)
    });

    var gzz = new models.GeoZone({
        name: 'Gz 1',
        loc: geoJsonPoly
    });

    gzz.save(function (err) {
        if (err) {
            console.log('GeoZones: model error', err);
        }
    });
*/
};

module.exports = GeoZones;
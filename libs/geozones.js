var models = require('./models.js');

/**
 *
 * @constructor
 */
var GeoZones = function () {
    this.checkPoint = function(coords, done){
        models.GeoZone.find({
            loc: {
                $geoIntersects: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coords
                    }
                }
            }
        }, function(err, data){
            if(err){
                return done(false);
            }else{
                return done(data);
            }
        });
    };
};

module.exports = new GeoZones();
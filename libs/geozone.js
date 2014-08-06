var models = require('./models.js');

/**
 *
 * @constructor
 */
var GeoZones = function () {
    this.checkPoint = function(coords, done){
        models.GeoZone.find({
            active: true,
            loc: {
                $geoIntersects: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coords
                    }
                }
            }
        }, { _id: 1, name: 1 }, function(err, data){
            if(err){
                return done(false);
            }else{
                return done(data);
            }
        });
    };
};

module.exports = new GeoZones();

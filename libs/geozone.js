var models = require('./models.js');

/**
 *
 * @constructor
 */
var GeoZone = function () {
    this.checkPoint = function(coords, user_id, done){
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
                console.log('Model GeoZones error: model error', err);
                return done(false);
            }else{
                return done(data);
            }
        });
    };

    this.getById = function(id, user_id, done){
        models.GeoZone.findOne({ _id: id }, function(err, data){
            if(err){
                console.log('Model GeoZones error: model error', err);
                return done(false);
            }else{
                return done(data);
            }
        });
    };
};

module.exports = new GeoZone();

var models = require('./models.js');

/**
 *
 * @constructor
 */
var GeoZone = function () {
	var _this = this;
	
    this.checkPoint = function(coords, user_id, done){
        models.GeoZone.findOne({
            active: true,
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
                console.log('Model GeoZones error: model error', err);
                return done(false);
            }else{
                return done(data);
            }
        });
    };

    this.getById = function(id, user_id, done){
		if (!id.match(/^[0-9a-fA-F]{24}$/)) {
			return done(false);
		}
		
        models.GeoZone.findOne({ _id: id }, function(err, data){
            if(err){
                console.log('Model GeoZones error: model error', err);
                return done(false);
            }else{
                return done(data);
            }
        });
    };
	
	this.processGeozones = function(point_data, device_data, user_data, onEnterGeozone, onExitGeozone, onUpdateGeozone) {
        function exit(geozone_data){
            if(onExitGeozone){
                onExitGeozone(geozone_data);
            }
        }

        function enter(geozone_data){
            if(onEnterGeozone){
                onEnterGeozone(geozone_data);
            }
        }

        function updateGeozone(geozone_data){
            if(onUpdateGeozone){
				onUpdateGeozone(geozone_data);
			}
        }

        this.getById(device_data.geozone, user_data._id, function(latest_geozone){
            _this.checkPoint([point_data.lat, point_data.lon], user_data._id, function(new_geozone){
                if(latest_geozone && new_geozone){
                    if(latest_geozone._id.toString() != new_geozone._id.toString()){
                        exit(latest_geozone, function(){
                            enter(new_geozone);
                        });
                        updateGeozone(new_geozone);
                    }
                }

                if(!latest_geozone && new_geozone){
                    enter(new_geozone);
                    updateGeozone(new_geozone);
                }

                if(latest_geozone && !new_geozone){
                    exit(latest_geozone);
                    updateGeozone(false);
                }
            });
        });
    };
};

module.exports = new GeoZone();

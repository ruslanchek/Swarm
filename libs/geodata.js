/**
 *
 * @constructor
 */
var Geodata = function () {
    /**
     * Пререводит GPRMC-строку протокола NMEA в объект
     *
     * @param {String} string GPRMC-строка протокола NMEA
     * @return {Object} data
     */
	this.parseGPRMC = function(string){
	    //NMEA
	    //hhmmss.dd,    S,  xxmm.dddd,  <N|S>,  yyymm.dddd, <E|W>,  s.s,    h.h,    ddmmyy, d.d,    D*HH
	    //03427.000,    A,  5534.4100,  N,      03754.2442, E,      0.00,   115,    200512, ,       *01

	    //var checksum   = str.substr(str.length - 2, str.length),
	    var str = string.substr(0, string.length - 3),
	        gprmc = utils.explode(',', str);

	    // TODO: Make here an MTK checksum checker
	    var data = {
	        time 				: gprmc[0],
	        sat_status			: (gprmc[1] == 'A') ? 1 : 0,
	        lat					: this.convertDMStoDD(gprmc[2]),
	        lon					: this.convertDMStoDD(gprmc[4]),
	        speed				: gprmc[6],
	        heading				: gprmc[7],
	        date 				: gprmc[8],
	        magnetic_variation 	: gprmc[9],
	        mode_indicator		: gprmc[10],
	        datetime 			: this.parseGprmcDateTimeToDate(gprmc[8], gprmc[0])
	    };

	    return data;
	};

    /**
     * Переводит NMEA GPRMC-формат даты в объект Date
     *
     * @param {String} gprmc_date NMEA-дата (yyymm.dddd)
     * @param {String} gprmc_time NMEA-время (hhmmss.dd)
     *
     * @return {Date|Boolean} дата и время
     */
    this.parseGprmcDate = function (gprmc_date, gprmc_time) {
        try {
            return new Date(
                parseInt('20' + gprmc_date.substr(4, 2), 10),
                    parseInt(gprmc_date.substr(2, 2), 10) - 1,
                parseInt(gprmc_date.substr(0, 2), 10),

                parseInt(gprmc_time.substr(0, 2), 10),
                parseInt(gprmc_time.substr(2, 2), 10),
                parseInt(gprmc_time.substr(4, 2), 10)
            );
        } catch (e) {
            console.log('Geodata: parseGprmcDate failed');
        }

        return false;
    };
};

module.exports = new Geodata();
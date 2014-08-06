var _ = require('lodash'),
    utils = require('../libs/utils.js'),
    checksum = require('../libs/checksum.js');

var Plugin = function (socket_data, options) {
    var _this = this,
        params = {},
        tags_params = {};

    this.options = {
        onComplete: function(data){

        },

        onEchoNeeded: function(data, encoding){

        }
    };

    _.extend(this.options, options);

    tags_params['01'] = {length: 1,     name: 'hw_ver',         method: 'hex2dec'};                     //Версия железа
    tags_params['02'] = {length: 1,     name: 'sw_ver',         method: 'hex2a'};                       //Версия прошивки
    tags_params['03'] = {length: 15,    name: 'imei',           method: 'hex2a',    reverse: false};    //IMEI (ASCII)
    tags_params['04'] = {length: 2,     name: 'dev_id',         method: 'hex2dec'};                     //Идентификатор устройства
    tags_params['10'] = {length: 2,     name: 'item_num',       method: 'hex2dec'};                     //Номер записи в архиве
    tags_params['20'] = {length: 4,     name: 'datetime',       method: 'hex2dec'};                     //Дата и время
    tags_params['30'] = {length: 9,     name: 'gps_data',       method: 'hex',      reverse: false};    //Координаты в градусах, число спутников, признак корректности определения координат.
    tags_params['33'] = {length: 4,     name: 'spd_head',       method: 'hex',      reverse: false};    //Скорость в км/ч и направление в градусах
    tags_params['34'] = {length: 2,     name: 'altitude',       method: 'hex2dec'};                     //Высота, м
    tags_params['35'] = {length: 1,     name: 'hdop',           method: 'hex2dec'};                     //HDOP
    tags_params['40'] = {length: 2,     name: 'dev_status',     method: 'hex'};                         //Статус устройства
    tags_params['41'] = {length: 2,     name: 'power_inp',      method: 'hex'};                         //Напряжение питания, мВ
    tags_params['42'] = {length: 2,     name: 'power_bat',      method: 'hex'};                         //Напряжение аккумулятора, мВ
    tags_params['43'] = {length: 1,     name: 'dev_temp',       method: 'hex2dec'};                     //Температура терминала, С
    tags_params['44'] = {length: 4,     name: 'acceleration',   method: 'hex'};                         //Ускорение
    tags_params['d4'] = {length: 4,     name: 'journey',        method: 'hex2dec'};                     //Общий пробег по данным GPS
    tags_params['50'] = {length: 4,     name: 'input1',         method: 'hex2dec'};                     //Input 1
    tags_params['51'] = {length: 4,     name: 'input2',         method: 'hex2dec'};                     //Input 2
    tags_params['52'] = {length: 4,     name: 'input3',         method: 'hex2dec'};                     //Input 3
    tags_params['53'] = {length: 4,     name: 'input4',         method: 'hex2dec'};                     //Input 4

    var processChecksum = function () {
        var checksum_received = utils.reverseBytes(socket_data.substr(-4, 4)),
            checksum_calculated = checksum.CRC16MODBUS(utils.hexStringToBytesArray(socket_data.substr(0, socket_data.length - 4)));

        if (checksum_received == checksum_calculated) {
            return checksum_received;
        } else {
            return false;
        }
    };

    var parse = function(){
        //Берем два байта длины пакета, разворачиваем (т.к. это little-endian)
        var tags_length = utils.reverseBytes(socket_data.substr(2, 4));

        //Переводим в binary
        tags_length = utils.convertNumToBase(tags_length, 16, 2).toString(); //1000000000010111

        //Отсекаем старший бит (признак наличия неотпр. данных)
        var unsended_flag = tags_length.substr(0, 1);

        //Отсекаем длину пакета
        tags_length = tags_length.substr(1, tags_length.length);

        //Переводим в decimal
        tags_length = utils.convertNumToBase(tags_length, 2, 10);

        params.tags_length = tags_length;
        params.unsended_flag = unsended_flag;
        params.tags = socket_data.substring(6, socket_data.length - 4);
    };

    var parseTags = function(){
        var offset = 0,
            tags = params.tags,
            data = {};

        for (var i = 0, l = tags.length; i < l; i += 2) {
            var tag_name = tags.substr(offset, 2),
                tp = tags_params[tag_name];

            if (tp) {
                offset += 2;

                var tag_data = tags.substr(offset, tp.length * 2);

                offset += tp.length * 2;

                data[tp.name] = (tp.reverse !== false) ? utils.reverseBytes(tag_data) : tag_data;

                switch (tp.method) {
                    case 'hex2a' :
                    {
                        data[tp.name] = utils.hex2a(data[tp.name]);
                    }
                        break;

                    case 'hex' :
                    {
                        data[tp.name] = data[tp.name];
                    }
                        break;

                    default :
                    {
                        data[tp.name] = utils.hexDec(data[tp.name]);
                    }
                        break;
                }

                if (offset >= l) {
                    break;
                }
            }
        }

        if(data.acceleration){
            data.acceleration = utils.hex2bin(data.acceleration);

            data.acceleration = {
                x: parseInt(data.acceleration.substr(data.acceleration.length - 10, 10), 2),
                y: parseInt(data.acceleration.substr(data.acceleration.length - 20, 10), 2),
                z: parseInt(data.acceleration.substr(data.acceleration.length - 30, 10), 2)
            };
        }

        //Parse GPSD
        if (data.gps_data) {
            //  1    0     0    0     0    0     0    0     0    0     0    0     0    0     0    0     0    0
            //  0001 0000  0000 0000  0000 0000  0000 0000  0000 0000  0000 0000  0000 0000  0000 0000  0000 0000

            //  0    6     38         41         51         03         04         53         3e         02
            //  0000 0110  0011 1000  0100 0001  0101 0001  0000 0011  0000 0100  0101 0011  0011 1110  0000 0010

            var gpsd_bin = utils.hex2bin(data.gps_data),
                gpsd_hex = data.gps_data,
                gpsd_parsed = {};

            gpsd_parsed.sat_count = utils.convertNumToBase(gpsd_bin.substr(4, 4), 2, 10);
            gpsd_parsed.sat_status = utils.convertNumToBase(gpsd_bin.substr(0, 4), 2, 10);

            if (gpsd_parsed.sat_status > 0) {
                gpsd_parsed.sat_status = 0;
            } else {
                gpsd_parsed.sat_status = 1;
            }

            gpsd_parsed.lat = utils.convertNumToBase(utils.reverseBytes(gpsd_hex.substr(2, 8)), 16, 10) / 1000000;
            gpsd_parsed.lon = utils.convertNumToBase(utils.reverseBytes(gpsd_hex.substr(10, 8)), 16, 10) / 1000000;

            if (data.datetime) {
                gpsd_parsed.datetime = new Date(data.datetime * 1000);
                gpsd_parsed.datetime.setMinutes(gpsd_parsed.datetime.getMinutes() + gpsd_parsed.datetime.getTimezoneOffset());
            }

            if (data.spd_head) {
                gpsd_parsed.speed = (utils.convertNumToBase(utils.reverseBytes(data.spd_head.substr(0, 4)), 16, 10) / 10) / 1.852;
                gpsd_parsed.heading = utils.convertNumToBase(utils.reverseBytes(data.spd_head.substr(4, 4)), 16, 10) / 10;
            }

            data.gps_data = gpsd_parsed;
        }

        if (data.power_inp) {
            data.power_inp = utils.convertNumToBase(data.power_inp, 16, 10) / 1000;
        }

        if (data.power_bat) {
            data.power_bat = utils.convertNumToBase(data.power_bat, 16, 10) / 1000;
        }

        if (data.hdop) {
            data.hdop = data.hdop / 10;
        } else {
            data.hdop = 0;
        }

        if (data.dev_status) {
            var status_bin = utils.hex2bin(data.dev_status);
            //  0011 0010 0000 0000

            data.dev_status = {
                vibration_level_1       : status_bin.substr(15, 1),
                slope_level             : status_bin.substr(14, 1),
                unused                  : status_bin.substr(13, 1),
                sim_card                : status_bin.substr(12, 1),
                geozone                 : status_bin.substr(11, 1),
                inner_battery_level     : status_bin.substr(10, 1),
                gps_antenna             : status_bin.substr(9, 1),
                inner_power_bus         : status_bin.substr(8, 1),
                outer_power_input       : status_bin.substr(7, 1),
                ignition                : status_bin.substr(6, 1),
                vibration_level_2       : status_bin.substr(5, 1),
                gis_system              : status_bin.substr(4, 1),
                gsm_signal_level        : utils.convertNumToBase(status_bin.substr(2, 2), 2, 10),
                alarm_engaged           : status_bin.substr(1, 1),
                alarm_status            : status_bin.substr(0, 1)
            };
        }

        return data;
    };

    var prepareData = function(data){
        if (data.gps_data) {
            if ( data.gps_data.sat_status == 0 || ( parseInt(data.gps_data.lat) == 0 && parseInt(data.gps_data.lon) == 0 ) || data.hdop <= 0 ) {
                return false;
            }

            params.telemetry = {
                gps: data.gps_data,
                altitude: data.altitude,
                journey: data.journey,
                acceleration: data.acceleration
            };

            params.device_params = {
                dev_temp: data.dev_temp,
                power_inp: data.power_inp,
                power_bat: data.power_bat,
				hdop: data.hdop,
				dev_status: data.dev_status,
                inputs: [
                    (data.input1 != null) ? utils.hexDec(data.input1) : false,
                    (data.input2 != null) ? utils.hexDec(data.input2) : false,
                    (data.input3 != null) ? utils.hexDec(data.input3) : false,
                    (data.input4 != null) ? utils.hexDec(data.input4) : false
                ]
            };

            params.imei = data.imei;
            params.dev_id = data.dev_id;

            return params;
        }
    };

    this.paramsOutputFormat = function () {
        /*
         {
             tags_length: '41',
             unsended_flag: '1',
             tags: '0338363832303430303135373734353004020020b2e5bd50300a90425103b8533e02330000580634a5003508400033410000429f0f4313445da227164508004600e0500000510000520000530000707f809000000000c000000000c100000000c200000000c300000000c400c500c600c700c800c900ca00cb00d4c4f00000d500d60000d70000d80000d90000da0000db00000000dc00000000dd00000000de00000000df00000000',
             telemetry: {
                gps: {
                    sat_count: '10',
                    sat_status: 1,
                    lat: 55.657104,
                    lon: 37.639096,
                    datetime: Tue Dec 04 2012 11:59:46 GMT+0400 (MSK),
                    speed: 0,
                    heading: 162.4
                 },
                altitude: 165,
                journey: undefined,
                acceleration: { x: 605, y: 488, z: 354 }
             },
            device_params: {
                dev_temp: 19,
                power_inp: 0,
                power_bat: 3.999,
                hdop: 0.8,
                dev_status: {
                    vibration_level_1: '0',
                    slope_level: '0',
                    unused: '0',
                    sim_card: '0',
                    geozone: '0',
                    inner_battery_level: '0',
                    gps_antenna: '0',
                    inner_power_bus: '0',
                    outer_power_input: '1',
                    ignition: '1',
                    vibration_level_2: '0',
                    gis_system: '0',
                    gsm_signal_level: '3',
                    alarm_engaged: '0',
                    alarm_status: '0'
                },
                inputs: [ false, false, false, false ] },
                imei: '868204001577450',
                dev_id: 2
            }
         */


        return {
            id          : params.dev_id,
            imei        : params.imei,
            inp         : params.device_params.inputs,

            gsm         : params.device_params.dev_status.gsm_signal_level,
            hdop        : params.device_params.hdop,

            bat         : params.device_params.power_bat,
            pow         : params.device_params.power_inp,

            tmp         : params.device_params.dev_temp,

            alt         : params.telemetry.altitude,
            hdg         : params.telemetry.gps.heading,
            spd         : params.telemetry.gps.speed,

            date        : params.telemetry.gps.datetime,
            lat         : params.telemetry.gps.lat,
            lon         : params.telemetry.gps.lon,

            sat         : params.telemetry.sat_count
        };
    };

    this.sendSuccesResponse = function(){
        var a = ['0x02'];
        a = a.concat(utils.hexStringToBytesArray(utils.reverseBytes(this.checksum_received)));
        var out = new Buffer(a, 'ascii');

        this.options.onEchoNeeded(out, 'ascii');
    };

    this.process = function () {
        this.checksum_received = processChecksum();

        if (this.checksum_received) {
            parse();

            var data = prepareData(parseTags());

            if(data){
                this.options.onComplete(this.paramsOutputFormat());
            }else{
                this.options.onEchoNeeded('1', 'ascii');
                console.log('galileo: GPS data is not valid!');
            }

        } else {
            this.options.onEchoNeeded('1', 'ascii');
            console.log('galileo: wrong checksum');
        }
    };
};

module.exports = Plugin;
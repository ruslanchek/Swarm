var Utils = function () {
    this.reverseBytes = function (str) {
        // Return if has invalid characters
        if (/[^a-f0-9]/.test(str.toLowerCase())) {
            return;
        }

        if (/[^a-f0-9]/i.test(str)) {
            return;
        }

        // Might need left padding
        str = (str.length % 2) ? '0' + str : str;

        // Split into an array of pairs, reverse and join again
        return str.match(/../g).reverse().join('');
    };

    this.hexStringToBytesArray = function (hex_string) {
        var a = [];

        for (var i = 0; i < hex_string.length; i += 2) {
            a.push("0x" + hex_string.substr(i, 2));
        }

        return a;
    };

    this.convertNumToBase = function (num, baseA, baseB) {
        if (!(baseA < 2 || baseB < 2 || isNaN(baseA) || isNaN(baseB) || baseA > 36 || baseB > 36)) {
            return parseInt(num, baseA).toString(baseB);
        }
    };

    this.hex2a = function (hex) {
        var str = '';

        for (var i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }

        return str;
    };

    this.hex2bin = function (hex) {
        var str = '';

        for (var i = 0; i < hex.length; i += 1) {
            var s = parseInt(hex.substr(i, 1), 16).toString(2);

            if (s.length < 4) {
                while (s.length < 4) {
                    s = '0' + s;
                }
            }

            str += s;
        }

        return str;
    };

    this.pad = function (number, length) {
        var str = '' + number;

        while (str.length < length) {
            str = '0' + str;
        }

        return str;
    };

    this.chr = function (ascii) {
        return String.fromCharCode(ascii);
    };

    this.hexDec = function (hex_string) {
        hex_string = (hex_string + '').replace(/[^a-f0-9]/gi, '');
        return parseInt(hex_string, 16);
    };

    this.hexToStr = function (hex) {
        var string = '';

        for (var i = 0, l = hex.length; i < l - 1; i += 2) {
            string += chr(hexDec(hex[i] + hex[i + 1]));
        }

        return string;
    };

    this.decHex = function (number) {
        if (number < 0) {
            number = 0xFFFFFFFF + number + 1;
        }

        return parseInt(number, 10).toString(16);
    };

    this.ord = function (string) {
        return string.charCodeAt(0);
    };
};

module.exports = new Utils();
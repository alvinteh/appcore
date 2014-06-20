define(function() {
    "use strict";

    var UuidHelper = (function() {
        return {
            /*
                @function generateUuid()

                Generates a UUID.

                @param {boolean = true} stripDashes     Flag indicating whether dashes should be stripped.

                @return {string}
            */
            generateUuid: function(stripDashes) {
                var string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

                if (typeof stripDashes === "undefined" || stripDashes === true) {
                    string = string.replace(/\-/g, "");
                }

                return string.replace(/[xy]/g, function(c) {
                    var r = Math.random() * 16 | 0;
                    var v = c === "x" ? r : (r & 0x3 | 0x8);

                    return v.toString(16);
                });
            }
        };
    })();

    return UuidHelper;
});

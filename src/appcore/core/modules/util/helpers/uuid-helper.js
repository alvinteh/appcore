define(function() {
    "use strict";

    return (function() {
        return {
            /*
                @function generateUuid()

                Generates a UUID.

                @param {boolean = true} stripDashes     Flag indicating whether dashes should be stripped.

                @return {string}
            */
            generateUuid: function(stripDashes) {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                    var r = Math.random() * 16 | 0;
                    var v = c === "x" ? r : (r & 0x3 | 0x8);

                    if (stripDashes) {
                        v = v.replace("-", "");
                    }

                    return v.toString(16);
                });
            }
        };
    })();
});
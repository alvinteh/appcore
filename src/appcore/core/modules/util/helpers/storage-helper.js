define(function() {
    "use strict";

    return (function() {
        return {
            /*
                @function set

                Saves the specified key-value pair in the session storage.

                @param {string} key                 The desired key
                @param {(string|number)} value      The desired value
            */
            set: function(key, value) {
                sessionStorage.setItem(key, value);
            },

            /*
                @function get

                Retrieves the value of the specified key from the session storage.

                @param {string} key     The desired key

                @return {mixed}
            */
            get: function(key) {
                return sessionStorage.getItem(key);
            },

            /*
                @function reset

                Removes the specified key (and corresponding value) from the session storage.

                @param {string} key     The desired key
            */
            reset: function(key) {
                sessionStorage.removeItem(key);
            }
        };
    })();
});
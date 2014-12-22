define(function() {
    "use strict";

    var _singleton = null;

    var ConfigModule = function() {
        //Private instance members
        var config = {};

        var ConfigModule = {
            /*
            @function get

            Retrieves the config data associated with the specified key.

            @param {string} key     The desired key

            @return {mixed}
            */
            get: function(key) {
                var tokens = key.split("."),
                    token,
                    currentNestedConfig = config;

                while (tokens.length) {
                    token = tokens.shift();

                    if (currentNestedConfig[token] === undefined) {
                        return undefined;
                    }
                    
                    currentNestedConfig = currentNestedConfig[token];
                }

                return currentNestedConfig;
            },

            /*
            @function set

            Sets the specified config key and value.

            @param {string} key     The desired key
            @param {mixed} value    The desired value
            */
            set: function(key, value) {
                var tokens = key.split("."),
                    token,
                    currentNestedConfig = config;

                while (tokens.length) {
                    token = tokens.shift();

                    if (currentNestedConfig[token] === undefined) {
                        currentNestedConfig[token] = {};
                    }

                    if (tokens.length) {
                        currentNestedConfig = currentNestedConfig[token];
                    }
                    else {
                        currentNestedConfig[token] = value;
                    }
                }
            },

            /*
            @function unset

            Unsets the specified config key and value (including child values).

            @param {string} key     The desired key
            */
            unset: function(key) {
                var tokens = key.split("."),
                token,
                currentNestedConfig = config;

                while (tokens.length) {
                    token = tokens.shift();

                    if (currentNestedConfig[token] === undefined) {
                        currentNestedConfig[token] = {};
                    }

                    if (tokens.length === 0) {
                        delete currentNestedConfig[token];
                        break;
                    }
                }
            },
        };

        //Public instance members
        return ConfigModule;
    };

    return (function() {
        if (_singleton === null || typeof _singleton === "undefined") {
            _singleton = ConfigModule;
        }

        return _singleton;
    })();
});

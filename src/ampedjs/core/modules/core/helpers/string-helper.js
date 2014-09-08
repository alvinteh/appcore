define(function() {
    "use strict";

    var StringHelper = (function() {
        return {
            /*
                @function convertToCamelCase

                Converts the specified snake-cased string to camel case.

                @param {string} string      The desired string

                @return {string}
            */
            convertToCamelCase: function(string) {
                return string.replace(/(\_\w)/g, function($1) { return $1[1].toUpperCase(); });
            },

            /*
                @function convertToSnakeCase

                Converts the specified camel-cased string to snake case.

                @param {string} string      The desired string

                @return {string}
            */
            convertToSnakeCase: function(string) {
                var ret = string.replace(/([A-Z])/g, function($1) { return "_" + $1.toLowerCase(); });

                if (ret.charAt(0) === "_") {
                    ret = ret.substring(1, 2).toLowerCase() + ret.substring(2);
                }

                return ret;
            },

            /*
                @function lowercaseFirst

                Converts the first character of the string to lower case.

                @param {string} string      The desired string

                @return {string}
            */
            lowercaseFirst: function(string) {
                return string.charAt(0).toLowerCase() + string.substring(1);
            },

            /*
                @function uppercaseFirst

                Converts the first character of the string to upper case.

                @param {string} string      The desired string

                @return {string}
            */
            uppercaseFirst: function(string) {
                return string.charAt(0).toUpperCase() + string.substring(1);
            },

            /*
                @function humanize

                Converts the string to a "human format", replacing underscores/uppercase characters.

                @param {string} string      The desired string

                @return {string}
            */
            humanize: function(string) {
                return string.replace(/([A-Z])/g, function($1) { return " " + $1.toLowerCase(); })
                    .replace(/_/g, " ");
            }
        };
    })();

    return StringHelper;
});

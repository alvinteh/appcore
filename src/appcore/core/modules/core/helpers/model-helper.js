define(function() {
    "use strict";

    var ModelHelper = (function() {
        return {
            /*
                @function getGetter

                Gets the name of the getter method of the specified attribute.

                @param {string} attribute       The desired attribute

                @return {string}
            */
            getGetter: function(attribute) {
                return "get" + attribute.charAt(0).toUpperCase() + attribute.substring(1);
            },

            /*
                @function getSetter

                Gets the name of the setter method of the specified attribute.

                @param {string} attribute       The desired attribute

                @return {string}
            */
            getSetter: function(attribute) {
                return "set" + attribute.charAt(0).toUpperCase() + attribute.substring(1);
            }
        };
    })();

    return ModelHelper;
});
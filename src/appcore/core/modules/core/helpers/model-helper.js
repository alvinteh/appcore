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
            },

            /*
                @function generateGettersSetters

                Generates getters and setters for the specified prototype and attributes

                @param {object} prototype       The desired prototype
                @param [{string}] attributes    The desired attributes
            */

            generateGettersSetters: function(prototype, attributes) {
                for (var i = 0, length = attributes.length; i < length; i++) {
                    //jshint -W083
                    (function(attribute) {
                        prototype[ModelHelper.getGetter(attribute)] = function() {
                            return this.get(attribute);
                        };

                        prototype[ModelHelper.getSetter(attribute)] = function(value) {
                            this.set(attribute, value);
                        };
                    })(attributes[i]);
                    //jshint +W083
                }
            }
        };
    })();

    return ModelHelper;
});
define(function(require) {
    "use strict";

    var Helper = require("./models/helper");

    var _singleton = null;

    var HelperModule = function() {
        //Private instance members
        var helpers = {};

        //Public instance members
        var HelperModule = {
            /*
                @function create

                Creates a Helper.

                @param {string} name        The desired Helper name.

                @return {object}
            */
            create: function(name) {
                //Create the child class constructor. Use a verbose method for performance optimization.
                var childClass = function() {
                    Helper.call(this, arguments);

                    return this;
                };

                //Implement inheritance
                childClass.prototype = Object.create(Helper.prototype);

                //Implement method manipulation methods
                childClass.addStaticMethod = function(name, method) {
                    Helper.addStaticMethod(childClass, name, method);
                };

                childClass.removeStaticMethod = function(name) {
                    Helper.removeStaticMethod(childClass, name);
                };

                childClass.hasStaticMethod = function(name) {
                    return Helper.hasStaticMethod(childClass, name);
                };

                helpers[name] = childClass;

                return helpers[name];
            },

            /*
                @function get

                Gets a Helper.

                @param {string} name        The desired Helper name.

                @return {object}
            */
            get: function(name) {
                return helpers[name];
            }
        };

        return HelperModule;
    };

    return (function() {
        if (_singleton === null || _singleton === undefined) {
            _singleton = HelperModule;
        }

        return _singleton;
    })();
});
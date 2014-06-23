define(function(require) {
    "use strict";

    var Helper = require("./models/helper");

    var _singleton = null;

    var HelperModule = function() {
        //Private instance members
        //(None)

        //Public instance members
        var HelperModule = {
            /*
                @function create

                Creates a Helper.

                @return {Helper}
            */
            create: function() {
                //Create the child class constructor. Use a verbose method for performance optimization.
                var childClass = {};

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

                return childClass;
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

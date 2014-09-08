define(function() {
    "use strict";

    /*
        @class Module

        @classdesc Module class.
    */

    /*
        @constructor Module

        Constructs a Module instance.

        @param {string} name                The desired name
        @param {object[]} components        The desired components
    */
    var Module = function(components) {
        //Private instance members
        //(None)

        //Public instance members
        for (var componentName in components) {
            this[componentName] = components[componentName];
        }

        //Return instance
        return this;
    };

    return Module;
});
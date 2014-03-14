define(function() {
    "use strict";

    /*
        @abstract
        @class Helper

        @classdesc Helper class.
    */

    /*
        @constructor Helper

        Constructs a Helper instance.
    */
    var Helper = function() {
        //Private instance members
        //(None)

        //Public instance members
        //(None)

        //Return instance
        return this;
    };

    //Public instance members
    /*
        @function addStaticMethod

        Adds the specified method to the specified helper.

        @param {object} helper       The desired helper
        @param {string} name        The desired method name
        @param {string} method      The desired method
    */
    Helper.addStaticMethod = function(helper, name, method) {
        helper[name] = method;
    };

    /*
        @function removeStaticMethod

        Removes the specified method from the specified helper.

        @param {object} helper       The desired helper
        @param {string} name        The desired method name
    */
    Helper.removeStaticMethod = function(helper, name) {
        delete helper[name];
    };

    /*
        @function hasStaticMethod

        Checks if the specified method exists in the specified helper.

        @param {object} helper       The desired helper
        @param {string} name        The desired method name

        @return {boolean}
    */
    Helper.hasStaticMethod = function(helper, name) {
        return typeof helper[name] === "function" && typeof helper.prototype[name] !== "function";
    };

    return Helper;
});
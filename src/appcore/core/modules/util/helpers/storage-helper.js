define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");

    var StorageHelper = Ac.Helper.create();

    /*
        @function set

        Saves the specified key-value pair in the session storage.

        @param {string} key                 The desired key
        @param {(string|number)} value      The desired value
    */
    StorageHelper.addStaticMethod("set", function(key, value) {
        sessionStorage.setItem(key, value);
    });

    /*
        @function get

        Retrieves the value of the specified key from the session storage.

        @param {string} key     The desired key

        @return {mixed}
    */
    StorageHelper.addStaticMethod("get", function(key) {
        return sessionStorage.getItem(key);
    });

    /*
        @function reset

        Removes the specified key (and corresponding value) from the session storage.

        @param {string} key     The desired key
    */
    StorageHelper.addStaticMethod("reset", function(key) {
        sessionStorage.removeItem(key);
    });

    return StorageHelper;
});
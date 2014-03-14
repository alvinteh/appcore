define(function(require) {
    "use strict";

    var UuidHelper = require("../helpers/uuid-helper");

    var _key = {};
    var _getAttributes = UuidHelper.generateUuid();

    /*
        @class Controller

        @classdesc Controller class.
    */

    /*
        @constructor Controller

        Constructs a Controller instance. Note that this does not add the Controller to AppCore's internal records.
    */
    var Controller = function() {
        //Private instance members
        var attributes = {
        };

        //Public instance members
        //(None)

        //Special instance method for private member access
        this[_getAttributes] = function(key) {
            if (key === _key) {
                return attributes;
            }
        };

        //Return instance
        return this;
    };

    Controller.prototype = (function(prototype) {
        //Private static members
        //(None)

        //Public prototype members
        

        return prototype;
    })(Controller.prototype || {});

    return Controller;
});
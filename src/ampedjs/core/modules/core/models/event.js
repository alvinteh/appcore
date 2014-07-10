define(function(require) {
    "use strict";

    var ModelHelper = require("../helpers/model-helper");
    var UuidHelper = require("../helpers/uuid-helper");

    var _key = {};
    var _getAttributes = UuidHelper.generateUuid();

    /*
        @class Event

        @classdesc Event class.
    */

    /*
        @constructor Event

        Constructs an Event instance.

        @param {string} name        The desired name
        @param {object} target      The desired event target
        @param [{object}] data      The desired event data
    */
    var Event = function(target, name, data) {
        //Private instance members
        var attributes = {
            target: target,
            name: name,
            data: data
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

    Event.prototype = (function(prototype) {
        //Private static members
        //(None)

        //Public prototype members
        /*
            @function get

            Gets the specified attribute.

            @param {string} attribute       The desired attribute

            @return {mixed}
        */
        prototype.get = function(attribute) {
            return this[_getAttributes](_key)[attribute];
        };

        /*
            @function set

            Sets the specified attribute.

            @param {string|object} attribute        The desired attribute OR attribute-value dictionary
            @param {mixed} value                    The desired value
        */
        prototype.set = function(attribute, value) {
            if (typeof value !== "undefined") {
                this[_getAttributes](_key)[attribute] = value;
            }
            else {
                for (var key in attribute) {
                    this[_getAttributes](_key)[key] = attribute[key];
                }
            }
        };

        //Generate getter and setter methods
        ModelHelper.generateGettersSetters(prototype, ["target", "name", "data"]);

        /*
            @function has

            Checks if the specified attribute is defined and not null.

            @param {string} attribute       The desired attribute

            @return {boolean}
        */
        prototype.has = function(attribute) {
            return typeof this[_getAttributes](_key)[attribute] !== "undefined" &&
                this[_getAttributes](_key)[attribute] !== null;
        };

        /*
            @function toObject

            Gets an object representation of the item.

            @return {object}
        */
        prototype.toObject = function() {
            var returnData = {};

            for (var property in this) {
                if (typeof this[property] === "function" && property.indexOf("set") === 0) {
                    var attribute = property.charAt(3).toLowerCase() + property.substring(4);
                    var methodName = "get" + property.substring(3);

                    if (typeof this[methodName] === "function" && methodName !== "getDataValue") {
                        var data = this[methodName]();

                        if (data && typeof data === "object" && typeof data.toObject === "function") {
                            data = data.toObject();
                        }

                        returnData[attribute] = data;
                    }
                }
            }

            return returnData;
        };

        return prototype;
    })(Event.prototype || {});

    return Event;
});

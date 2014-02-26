define(function(require) {
    "use strict";

    var UuidHelper = require("../../util/helpers/uuid-helper");

    var _key = {};
    var _getAttributes = UuidHelper.generateUuid();

    /*
        @abstract
        @class Model

        @classdesc Model class.
    */

    /*
        @constructor Model

        Constructs a Model instance.
    */
    var Model = function() {
        //Private instance members
        var attributes = {
            id: null,
            attributes: {}
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

    Model.prototype = (function(prototype) {
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
            @function setId

            Sets the specified attribute.

            @param {string|object} attribute        The desired attribute OR attribute-value dictionary
            @param {mixed} value                    The desired value
        */
        prototype.set = function(attribute, value) {
            if (value !== undefined) {
                this[_getAttributes](_key)[attribute] = value;
            }
            else {
                for (var key in attribute) {
                    this[_getAttributes](_key)[key] = attribute[key];
                }
            }
        };

        /*
            @function has

            Checks if the specified attribute is defined and not null.

            @param {string} attribute       The desired attribute

            @return {boolean}
        */
        prototype.has = function(attribute) {
            return this[_getAttributes](_key)[attribute] !== undefined &&
                this[_getAttributes](_key)[attribute] !== null;
        };

        /*
            @function getId

            Returns the instance identifier.

            @return {int}
        */
        prototype.getId = function() {
            return this[_getAttributes](_key).id;
        };

        /*
            @function setId

            Sets the instance identifier.
        */
        prototype.setId = function(id) {
            this[_getAttributes](_key).id = id;
        };

        /*
            @function addMethod

            Adds the specified method to the prototype.

            @param {string} name        The desired method name
            @param {string} method      The desired method
        */
        prototype.addMethod = function(name, method) {
            this.prototype[name] = method;
        };

        /*
            @function removeMethod

            Removes the specified method from the prototype.

            @param {string} name        The desired method name
        */
        prototype.removeMethod = function(name) {
            delete this.prototype[name];
        };

        /*
            @function hasMethod

            Checks if the specified method exists.

            @param {string} name        The desired method name

            @return {boolean}
        */
        prototype.hasMethod = function(name) {
            return typeof this.prototype[name] === "function";
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
    })(Model.prototype || {});

    return Model;
});
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

    //Public instance members
    /*
        @function addMethod

        Adds the specified method to the specified model's prototype.

        @param {object} model       The desired model
        @param {string} name        The desired method name
        @param {string} method      The desired method
    */
    Model.addMethod = function(model, name, method) {
        model.prototype[name] = method;
    };

    /*
        @function removeMethod

        Removes the specified method from the specified model's prototype.

        @param {object} model       The desired model
        @param {string} name        The desired method name
    */
    Model.removeMethod = function(model, name) {
        delete model.prototype[name];
    };

    /*
        @function hasMethod

        Checks if the specified method exists in the specified model's prototype.

        @param {object} model       The desired model
        @param {string} name        The desired method name

        @return {boolean}
    */
    Model.hasMethod = function(model, name) {
        return typeof model.prototype[name] === "function";
    };

    /*
        @function addStaticMethod

        Adds the specified method to the specified model.

        @param {object} model       The desired model
        @param {string} name        The desired method name
        @param {string} method      The desired method
    */
    Model.addStaticMethod = function(model, name, method) {
        model[name] = method;
    };

    /*
        @function removeStaticMethod

        Removes the specified method from the specified model.

        @param {object} model       The desired model
        @param {string} name        The desired method name
    */
    Model.removeMethod = function(model, name) {
        delete model[name];
    };

    /*
        @function hasStaticMethod

        Checks if the specified method exists in the specified model.

        @param {object} model       The desired model
        @param {string} name        The desired method name

        @return {boolean}
    */
    Model.hasStaticMethod = function(model, name) {
        return typeof model[name] === "function" && typeof model.prototype[name] !== "function";
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
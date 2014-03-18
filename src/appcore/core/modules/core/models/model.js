define(function(require) {
    "use strict";

    var Event = require("../models/event");
    var EventHelper = require("../helpers/event-helper");
    var UuidHelper = require("../helpers/uuid-helper");

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
            attributes: {},
            validationRules: {}
        };

        //Public instance members
        //(None)

        //Special instance method for private member access
        this[_getAttributes] = function(key) {
            if (key === _key) {
                return attributes.attributes;
            }
        };

        //Return instance
        return this;
    };

    //Public instance members
    Model.init = function(model) {
        model.prototype = (function(prototype) {
            //Private static members
            var staticAttributes = {
                validationRules: {}
            };

            //Public static members
            /*
                @function addMethod

                Adds the specified method to the model's prototype.

                @param {string} name        The desired method name
                @param {string} method      The desired method
            */
            model.addMethod = function(name, method) {
                model.prototype[name] = method;
            };

            /*
                @function removeMethod

                Removes the specified method from the model's prototype.

                @param {string} name        The desired method name
            */
            model.removeMethod = function(name) {
                delete model.prototype[name];
            };

            /*
                @function hasMethod

                Checks if the specified method exists in the model's prototype.

                @param {string} name        The desired method name

                @return {boolean}
            */
            model.hasMethod = function(name) {
                return typeof model.prototype[name] === "function";
            };

            /*
                @function addStaticMethod

                Adds the specified method to the model.

                @param {string} name        The desired method name
                @param {string} method      The desired method
            */
            model.addStaticMethod = function(name, method) {
                model[name] = method;
            };

            /*
                @function removeStaticMethod

                Removes the specified method from the model.

                @param {object} model       The desired model
            */
            Model.removeStaticMethod = function(name) {
                delete model[name];
            };

            /*
                @function hasStaticMethod

                Checks if the specified method exists in the model.

                @param {string} name        The desired method name

                @return {boolean}
            */
            Model.hasStaticMethod = function(model, name) {
                return typeof model[name] === "function" && typeof model.prototype[name] !== "function";
            };

            /*
                @function getValidationRules

                Gets the validation rules for the specified model.

                @param {object} model       The desired model

                @return {object[]}
            */
            model.getValidationRules = function() {
                return staticAttributes.validationRules;
            };

            /*
                @function setValidationRules

                Sets the specified validation rules for the specified model.

                @param {object} model       The desired model
                @param {string} rules       The desired validation rules
            */
            model.setValidationRules = function(rules) {
                staticAttributes.validationRules = rules;
            };

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
                var changes = [];
                var change, oldValue;

                if (value !== undefined) {
                    oldValue = this[_getAttributes](_key)[attribute];
                    this[_getAttributes](_key)[attribute] = value;

                    //Trigger events if necessary
                    if (oldValue !== value) {
                        changes.push({
                            attribute: attribute,
                            oldValue: oldValue,
                            newValue: value
                        });
                    }
                }
                else {
                    for (var key in attribute) {
                        oldValue = this[_getAttributes](_key)[key];
                        this[_getAttributes](_key)[key] = attribute[key];

                        if (oldValue !== attribute[key]) {
                            changes.push({
                                attribute: key,
                                oldValue: oldValue,
                                newValue: attribute[key]
                            });
                        }
                    }
                }

                if (changes.length > 0) {
                    for (var i = 0, length = changes.length; i < length; i++) {
                        change = changes[i];

                        this.trigger("change:" + change.attribute, {
                            oldValue: change.oldValue,
                            newValue: change.newValue
                        });
                    }

                    this.trigger("change", changes);
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
                var oldValue = this[_getAttributes](_key).id;
                if (oldValue !== id) {
                    this.trigger("change:id", {
                        oldValue: oldValue,
                        newValue: id
                    });

                    this.trigger("change", [{
                        attribute: "id",
                        oldValue: oldValue,
                        newValue: id
                    }]);
                }

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

            /*
                @function trigger

                Triggers an event on the item.

                @param {string} event       The desired event name
                @param [{object}] args      Additional arguments for the event
            */
            prototype.trigger = function(event, args) {
                EventHelper.trigger(new Event(this, event, args));
            };

            /*
                @function validate

                Validates the current item.

                @return {boolean}
            */
            prototype.validate = function() {

            };

            return prototype;
        })(model.prototype || {});
    };

    return Model;
});
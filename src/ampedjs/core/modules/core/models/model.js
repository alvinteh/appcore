define(function(require) {
    "use strict";

    var Event = require("../models/event");
    var EventHelper = require("../helpers/event-helper");
    var StringHelper = require("../helpers/string-helper");
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

        @param {string} modelName       The desired model name
        @param {string[]} attributes    The desired model attributes
    */
    var Model = function(modelName, modelAttributes) {
        //Private instance members
        var attributes = {
            id: null,
            attributes: {},
            validationRules: {}
        };

        for (var i = 0, length = modelAttributes.length; i < length; i++) {
            attributes.attributes[modelAttributes[i]] = null;
        }

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
    Model.init = function(name, model) {
        model.prototype = (function(prototype) {
            //Private static members
            var staticAttributes = {
                modelName: name,
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

                @param {string} name        The desired method name
            */
            model.removeStaticMethod = function(name) {
                delete model[name];
            };

            /*
                @function hasStaticMethod

                Checks if the specified method exists in the model.

                @param {string} name        The desired method name

                @return {boolean}
            */
            model.hasStaticMethod = function(name) {
                return typeof model[name] === "function" && typeof model.prototype[name] !== "function";
            };

            /*
                @function addStaticAttribute

                Adds the specified attribute to the model.

                @param {string} name        The desired method name
                @param {string} value       The desired value
            */
            model.addStaticAttribute = function(name, value) {
                model[name] = value;
            };

            /*
                @function removeStaticAttribute

                Removes the specified attribute from the model.

                @param {object} name        The desired attribute name
            */
            model.removeStaticAttribute = function(name) {
                delete model[name];
            };

            /*
                @function hasStaticMethod

                Checks if the specified method exists in the model.

                @param {string} name        The desired method name

                @return {boolean}
            */
            model.hasStaticAttribute = function(name) {
                var type = typeof model[name];
                return  type !== "undefined"  && type !== "function" && typeof model.prototype[name] !== type;
            };

            /*
                @function getModelName()

                Gets the model's name.

                @return {string}
            */
            model.getModelName = function() {
                return staticAttributes.modelName;
            };

            /*
                @function fromObject()

                Create an instance of the model

                @param {object} object      The desired object

                @return {object}
            */
            model.fromObject = function(object) {
                //jshint -W055
                var instance = new model();
                //jshint +W055

                for (var property in object) {
                    if (object.hasOwnProperty(property) &&
                        typeof object[property] !== "object" && typeof object[property] !== "function") {
                        instance.set(StringHelper.convertToCamelCase(property), object[property]);
                    }
                }

                return instance;
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

                @param {string|object} attribute                The desired attribute OR attribute-value dictionary
                @param {mixed} value                            The desired value
                @param [{object}] options                       Additional options for the method
                @param [{boolean = false}] options.silent       Flag indicating whether the change event should be
                                                                triggered
            */
            prototype.set = function(attribute, value, options) {
                var silent = options && options.silent === true;

                var changes = [];
                var change, oldValue;

                if (typeof attribute !== "object" && typeof value !== "undefined") {
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
                    silent = value && value.silent === true;

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

                        if (!silent) {
                            this.trigger("change:" + change.attribute, {
                                oldValue: change.oldValue,
                                newValue: change.newValue
                            });
                        }
                    }

                    if (!silent) {
                        this.trigger("change", changes);
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
                return typeof this[_getAttributes](_key)[attribute] !== "undefined" &&
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
                @function getModel()

                Gets the model of the item.

                @return {function}
            */
            prototype.getModel = function() {
                return model;
            };

            /*
                @function toObject

                Gets an object representation of the item.

                @return {object}
            */
            prototype.toObject = function() {
                var returnData = {};

                var attributes = this[_getAttributes](_key);

                for (var attribute in attributes) {
                    returnData[attribute] = attributes[attribute];
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
                @function observe

                Observes the item for the specified event such that the specified event listener is called
                when the aforementioned event fires.

                @param {string} event                   The desired event to be observed
                @param {function} eventListener         The desired event listener
            */
            prototype.observe = function(event, eventListener) {
                EventHelper.observe(this, event, eventListener);
            };

            /*
                @function unobserve

                Stops observing the item for the specified and specified event listener.

                @param {string} event                   The desired event to stop observing
                @param {function} eventListener         The desired event listener
            */
            prototype.unobserve = function(event, eventListener) {
                EventHelper.unobserve(this, event, eventListener);
            };

            /*
                @function validate

                Validates the current item.

                @return {boolean||object[]}
            */
            prototype.validate = function() {
                var modelRules = staticAttributes.validationRules;
                var modelErrors = {};
                var attributeRules, attributeRequired, attributeErrors, attributeOverride, attributeValue,
                attributeName, rule;

                function addError(message) {
                    attributeErrors.push(rule.message || message);
                }

                function isEmpty(value) {
                    return typeof value === "undefined" || value === null || value === "";
                }

                for (var attribute in modelRules) {
                    attributeRules = modelRules[attribute];
                    attributeValue = this[_getAttributes](_key)[attribute];
                    attributeErrors = [];
                    attributeOverride = false;
                    attributeRequired = false;
                    attributeName = StringHelper.uppercaseFirst(StringHelper.humanize(attribute));

                    //Set override flag to allow nulls/etc. for non-required attributes with type checks
                    for (var i = 0, length = attributeRules.length; i < length; i++) {
                        if (attributeRules[i].required === true) {
                            attributeRequired = true;
                            break;
                        }
                    }
                    attributeOverride = (!attributeRequired && (attributeValue === null ||
                        typeof attributeValue === "undefined" || attributeValue === ""));

                    for (i = 0, length = attributeRules.length; i < length; i++) {
                        rule = attributeRules[i];

                        if (rule.required) {
                            if (isEmpty(attributeValue)) {
                                addError(attributeName + " is required.");
                            }
                        }
                        else if (rule.type) {
                            if (!attributeOverride) {
                                if (rule.type === "string" && typeof attributeValue !== "string") {
                                    addError(attributeName + " should be a string.");
                                }
                                else if (rule.type === "int" && (typeof attributeValue !== "number" ||
                                    attributeValue % 1 !== 0)) {
                                    addError(attributeName + " should be an integer.");
                                }
                                else if (rule.type === "number" && typeof attributeValue !== "number") {
                                    addError(attributeName + " should be a number.");
                                }
                                else if (rule.type === "boolean" && typeof attributeValue !== "boolean") {
                                    addError(attributeName + " should be a boolean.");
                                }
                            }
                        }
                        else if (rule.minLength) {
                            if (isEmpty(attributeValue) || typeof attributeValue !== "string" ||
                                attributeValue.length < rule.minLength) {
                                addError(attributeName + " should be at least " + rule.minLength + " characters long.");
                            }
                        }
                        else if (rule.maxLength) {
                            if (isEmpty(attributeValue) || typeof attributeValue !== "string" ||
                                attributeValue.length > rule.maxLength) {
                                addError(attributeName + " should be at most " + rule.maxLength + " characters long.");
                            }
                        }
                        else if (rule.minValue) {
                            if (isEmpty(attributeValue) ||  typeof attributeValue !== "number" ||
                                attributeValue < rule.minValue) {
                                addError(attributeName + " should be at least " + rule.minValue + ".");
                            }
                        }
                        else if (rule.maxValue) {
                            if (isEmpty(attributeValue) || typeof attributeValue !== "number" ||
                                attributeValue > rule.maxValue) {
                                addError(attributeName + " should be at most " + rule.maxValue + ".");
                            }
                        }
                        else if (rule.format) {
                            if (
                                //jshint -W101
                                (rule.format === "email" && !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(attributeValue)) ||
                                (rule.format === "alpha" && !/^[a-z]*$/i.test(attributeValue)) ||
                                (rule.format === "flag" && attributeValue !== 0 && attributeValue !== 1) ||
                                (rule.format === "alphanumeric" && !/^[a-z0-9]*$/i.test(attributeValue)) ||
                                (rule.format === "creditcard" && !/^(?:4[0-9]{12}(?:[0-9]{3})|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/.test(attributeValue))
                                //jshint +W101
                                ) {
                                addError(attributeName + " should be a valid " + rule.format);
                            }
                        }
                        else if (rule.regex) {
                            if (isEmpty(attributeValue) || !rule.regex.test(attributeValue)) {
                                addError(attributeName + " should match " + rule.regex + ".");
                            }
                        }
                        else if (rule.function) {
                            var result = rule.function(attributeValue, this);
                            if (result !== true) {
                                addError(result);
                            }
                        }
                    }

                    if (attributeErrors.length > 0) {
                        modelErrors[attribute] = attributeErrors;
                    }

                }

                return (JSON.stringify(modelErrors) === "{}" || modelErrors);
            };

            /*
                @function isValid

                Validates the current item.

                @return {boolean}
            */
            prototype.isValid = function() {
                return this.validate() === true;
            };

            return prototype;
        })(model.prototype || {});
    };

    return Model;
});

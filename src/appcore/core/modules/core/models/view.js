define(function(require) {
    "use strict";

    var ModelHelper = require("../helpers/model-helper");
    var UuidHelper = require("../helpers/uuid-helper");

    var _key = {};
    var _getAttributes = UuidHelper.generateUuid();

    /*
        @class View

        @classdesc View class.
    */

    /*
        @constructor View

        Constructs a View instance. Note that this does not add the View to AppCore's internal records.

        @param [htmlElement[]|htmlElement|string] elements      The desired HTML element(s)
    */
    var View = function(elements) {
        //Private instance members
        var attributes = {
            dataBindings: [],
            elements: (function (elements) {
                if (elements instanceof Array) {
                    return elements;
                }
                else if (elements instanceof HTMLElement) {
                    return [elements];
                }
                else {
                    return document.querySelectorAll(elements);
                }
            })(elements)
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

    View.prototype = (function(prototype) {
        //Private static members
        //(None)

        //Public prototype members
        /*
            @function getElements

            Retrieves the View's elements.

            @return {object[]}
        */
        prototype.getElements = function() {
            return this[_getAttributes](_key).elements;
        };

        /*
            @function isDataBoundTo

            Checks if the view is data bound to the specified model instance.

            @param {object} instance        The desired model instance

            @return {boolean}
        */
        prototype.isDataBoundTo = function(instance) {
            var dataBindings = this[_getAttributes](_key).dataBindings;

            for (var i = 0, length = dataBindings.length; i < length; i++) {
                var dataBinding = dataBindings[i];

                if (dataBinding.object === instance) {
                    return true;
                }
            }

            return false;
        };

        /*
            @function hasDataBindings

            Checks if the view has any data bindings.

            @return {boolean}
        */
        prototype.hasDataBindings = function() {
            return this[_getAttributes](_key).dataBindings.length > 0;
        };


        /*
            @function refresh

            Refreshes the view with the specified model instance.

            @param [{object}] instance      The desired model instance.
        */
        prototype.refresh = function(instance) {
            var attributes = this[_getAttributes](_key);
            var dataBindings = attributes.dataBindings;
            var elements = attributes.elements;

            for (var i = 0, iLength = dataBindings.length; i < iLength; i++) {
                var dataBinding = dataBindings[i];

                if (instance === undefined || dataBinding.object === instance) {
                    var objectProperty = dataBinding.objectProperty;

                    for (var j = 0, jLength = dataBinding.elementProperties.length; j < jLength; j++) {
                        var elementProperty = dataBinding.elementProperties[j];

                        for (var k = 0, kLength = elements.length; k < kLength; k++) {
                            var element = elements[k];

                            element[elementProperty] = typeof objectProperty === "string" ?
                                dataBinding.object[ModelHelper.getGetter(objectProperty)]() :
                                dataBinding.objectProperty();
                        }
                    }
                }
            }
        };

        /*
            @function addDataBinding

            Data-binds the view with the specified model instance.

            @param [{object}] instance                      The desired model instance
            @param {string|function} objectProperty         The desired object property
            @param {string|string[]} elementProperties      The desired element properties
            @param [{boolean = true}] twoWay                Flag indicating whether the binding is two-way
        */
        prototype.addDataBinding = function(instance, objectProperty, elementProperties, twoWay) {
            var attributes = this[_getAttributes](_key);
            var dataBindings = attributes.dataBindings;

            dataBindings.push({
                elementProperties: elementProperties instanceof Array ? elementProperties : [elementProperties],
                object: instance,
                objectProperty: objectProperty,
                twoWay: twoWay !== false
            });

            this.refresh(instance);
        };

        return prototype;
    })(View.prototype || {});

    return View;
});
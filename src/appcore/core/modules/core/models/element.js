define(function(require) {
    "use strict";

    var UuidHelper = require("../helpers/uuid-helper");

    var _key = {};
    var _getAttributes = UuidHelper.generateUuid();

    /*
        @class Element

        @classdesc Element class.
    */

    /*
        @constructor Element

        Constructs an Element instance.

        @param [{HTMLElement[]|HTMLElement|string}] elements        The desired HTML element(s)
    */
    var Element = function(elements) {
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

    Element.prototype = (function(prototype) {
        //Private static members
        //(None)

        //Public prototype members
        /*
            @function getElement

            Retrieves the Element's first element.

            @return {HTMLElement}
        */
        prototype.getElement = function() {
            return this[_getAttributes](_key).elements[0];
        };

        /*
            @function getElements

            Retrieves the Element's elements.

            @return {HTMLElement[]}
        */
        prototype.getElements = function() {
            return this[_getAttributes](_key).elements;
        };

        /*
            @function isDataBoundTo

            Checks if the Element is data bound to the specified Model instance.

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

            Checks if the Element has any data bindings.

            @return {boolean}
        */
        prototype.hasDataBindings = function() {
            return this[_getAttributes](_key).dataBindings.length > 0;
        };


        /*
            @function refresh

            Refreshes the Element with the specified Model instance.

            @param [{object}] instance      The desired Model instance.
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
                                dataBinding.object.get(objectProperty) : dataBinding.objectProperty();
                        }
                    }
                }
            }
        };

        /*
            @function addDataBinding

            Data-binds the Element to the specified Model instance.

            @param {object} instance                                        The desired Model instance
            @param {string|function} objectProperty                         The desired object property
            @param [{string = "innerHTML"|string[]}] elementProperties      The desired element properties
            @param [{boolean = true}] twoWay                                Flag indicating whether the data-binding is
                                                                            two-way
        */
        prototype.addDataBinding = function(instance, objectProperty, elementProperties, twoWay) {
            var attributes = this[_getAttributes](_key);
            var dataBindings = attributes.dataBindings;

            dataBindings.push({
                elementProperties: (function(elementProperties) {
                    if (elementProperties === undefined) {
                        return ["innerHTML"];
                    }
                    else {
                        return elementProperties instanceof Array ? elementProperties : [elementProperties];
                    }
                })(elementProperties),
                object: instance,
                objectProperty: objectProperty,
                twoWay: twoWay !== false
            });

            this.refresh(instance);
        };

        /*
            @function removeDataBinding

            Removes data-bindings matching the specified Model instance from the Element.

            @param {object} instance                            The desired Model instance
            @param [{string|function}] objectProperty           The desired object property
            @param [{string|string[]}] elementProperties        The desired element properties
            @param [{boolean = true}] twoWay                    Flag indicating whether the data-binding is two-way
        */
        prototype.removeDataBinding = function(instance, objectProperty, elementProperties, twoWay) {
            var attributes = this[_getAttributes](_key);
            var dataBindings = attributes.dataBindings;
            var dataBinding;

            var normalizedElementProperties = elementProperties instanceof Array ? elementProperties.sort() :
                [elementProperties].sort();

            for (var i = 0, length = dataBindings.length; i < length; i++) {
                dataBinding = dataBindings[i];


                if (
                    dataBinding.object === instance &&
                    (objectProperty === undefined || dataBinding.objectProperty === objectProperty) &&
                    (
                        elementProperties === undefined ||
                        JSON.stringify(dataBinding.elementProperties) === JSON.stringify(normalizedElementProperties)
                    ) &&
                    (twoWay === undefined || dataBinding.twoWay === twoWay)
                ) {
                    delete dataBindings[i];
                }
                dataBindings.push({
                    elementProperties: elementProperties instanceof Array ? elementProperties : [elementProperties],
                    object: instance,
                    objectProperty: objectProperty,
                    twoWay: twoWay !== false
                });
            }
        };


        return prototype;
    })(Element.prototype || {});

    return Element;
});
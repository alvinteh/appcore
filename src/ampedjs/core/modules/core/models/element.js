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

    Element.REVERSE_BINDING = 0;
    Element.ONE_WAY_BINDING = 1;
    Element.TWO_WAY_BINDING = 2;

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

            var dataBinding, objectProperty, elementProperty, forwardTransform, value;

            for (var i = 0, iLength = dataBindings.length; i < iLength; i++) {
                dataBinding = dataBindings[i];

                if ((typeof instance === "undefined" || dataBinding.object === instance) &&
                    dataBinding.direction !== Element.REVERSE_BINDING) {
                    objectProperty = dataBinding.objectProperty;

                    for (var j = 0, jLength = dataBinding.elementProperties.length; j < jLength; j++) {
                        elementProperty = dataBinding.elementProperties[j];
                        forwardTransform = dataBinding.forwardTransform;

                        value = dataBinding.object.get(objectProperty);

                        if (forwardTransform) {
                            value = forwardTransform(value, instance);
                        }

                        if (elementProperty !== null) {
                            for (var k = 0, kLength = elements.length; k < kLength; k++) {
                                if (elementProperty.indexOf("data-") === 0) {
                                    elements[k].setAttribute("data-" + elementProperty.substring(5), value);
                                }
                                else if (elementProperty.indexOf("dataset.") === 0) {
                                    elements[k].setAttribute("data-" + elementProperty.substring(8), value);
                                }
                                else if (elementProperty.indexOf("style.") === 0) {
                                    elements[k].style[elementProperty.substring(6)] = value;
                                }
                                else {
                                    elements[k][elementProperty] = value;
                                }
                            }
                        }
                    }
                }
            }
        };

        /*
            @function addDataBinding

            Data-binds the Element to the specified Model instance. If unspecified, the element properties argument
            defaults to innerHTML/value for the first element.

            @param {object} instance                                    The desired Model instance
            @param {string|function} objectProperty                     The desired object property
            @param [{string|string[]}] options.elementProperties        The desired element properties
            @param [{int = 2}] options.direction                        The desired binding direction
            @param [{function}] options.forwardTransform                The desired transformation function to be run
                                                                        when performing property-to-element updates
            @param [{function}] options.backwardTransform               The desired transformation function to be run
                                                                        when performing element-to-property updates
        */
        prototype.addDataBinding = function(instance, objectProperty, options) {
            var elementProperties = options && typeof options.elementProperties !== "undefined" ?
                options.elementProperties : undefined;
            var direction = options && typeof options.direction !== "undefined" ?
                options.direction : Element.TWO_WAY_BINDING;
            var forwardTransform = options && options.forwardTransform ? options.forwardTransform : undefined;
            var backwardTransform = options && options.backwardTransform ? options.backwardTransform : undefined;

            var attributes = this[_getAttributes](_key);
            var dataBindings = attributes.dataBindings;

            var me = this;

            dataBindings.push({
                elementProperties: (function(elementProperties) {
                    if (typeof elementProperties === "undefined") {
                        return (typeof me.getElements()[0].value === "undefined" ? ["innerHTML"] : ["value"]);
                    }
                    else {
                        return elementProperties instanceof Array ? elementProperties : [elementProperties];
                    }
                })(elementProperties),
                object: instance,
                objectProperty: objectProperty,
                direction: direction,
                forwardTransform: forwardTransform,
                backwardTransform: backwardTransform
            });

            if (direction !== Element.REVERSE_BINDING) {
                this.refresh(instance);
            }
        };

        /*
            @function removeDataBinding

            Removes data-bindings matching the specified Model instance from the Element.

            @param {object} instance                                    The desired Model instance
            @param [{string|function}] objectProperty                   The desired object property
            @param [{string|string[]}] options.elementProperties        The desired element properties
            @param [{int = 2}] options.direction                        The desired binding direction
            @param [{function}] options.forwardTransform                The desired transformation function to be run
                                                                        when performing property-to-element updates
            @param [{function}] options.backwardTransform               The desired transformation function to be run
                                                                        when performing element-to-property updates
        */
        prototype.removeDataBinding = function(instance, objectProperty, options) {
            var elementProperties = options ? options.elementProperties : undefined;
            var direction = options ? options.direction : undefined;
            var forwardTransform = options ? options.forwardTransform : undefined;
            var backwardTransform = options ? options.backwardTransform : undefined;

            var attributes = this[_getAttributes](_key);
            var dataBindings = attributes.dataBindings;
            var dataBinding;

            var normalizedElementProperties = elementProperties instanceof Array ? elementProperties.sort() :
                [elementProperties];

            for (var i = dataBindings.length - 1; i >= 0; i--) {
                dataBinding = dataBindings[i];

                if (
                    dataBinding.object === instance &&
                    (
                        typeof objectProperty === "undefined" || dataBinding.objectProperty === objectProperty
                    ) &&
                    (
                        typeof elementProperties === "undefined" ||
                        JSON.stringify(dataBinding.elementProperties) === JSON.stringify(normalizedElementProperties)
                    ) &&
                    (
                        typeof direction === "undefined" || dataBinding.direction === direction
                    ) &&
                    (
                        typeof forwardTransform === "undefined" || dataBinding.forwardTransform === forwardTransform
                    ) &&
                    (
                        typeof backwardTransform === "undefined" || dataBinding.backwardTransform === backwardTransform
                    )
                ) {
                    dataBindings.splice(i, 1);
                }
            }
        };

        return prototype;
    })(Element.prototype || {});

    return Element;
});

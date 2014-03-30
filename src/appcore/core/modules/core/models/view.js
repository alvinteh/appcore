define(function(require) {
    "use strict";

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

        @param [htmlElement|string] containerElement        The desired container HTML element or selector.
    */
    var View = function(containerElement) {
        //Private instance members
        var attributes = {
            dataBindings: [],
            containerElement: (function (containerElement) {
                if (containerElement instanceof HTMLElement) {
                    return containerElement;
                }
                else {
                    return document.querySelector(containerElement);
                }
            })(containerElement),
            elements: []
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
            @function getContainerElement

            Retrieves the View's container element.

            @return {HTMLElement}
        */
        prototype.getContainerElement = function() {
            return this[_getAttributes](_key).containerElement;
        };

        /*
            @function getElements

            Retrieves the View's Elements.

            @return {Element[]}
        */
        prototype.getElements = function() {
            return this[_getAttributes](_key).elements;
        };

        /*
            @function addElement

            Adds the specified Element to the View.
        */
        prototype.addElement = function(element) {
            var elements = this[_getAttributes](_key).elements;

            if (elements.indexOf(element) === -1) {
                elements.push(element);
            }
        };

        /*
            @function removeElement

            Removes the specified Element from the View.
        */
        prototype.removeElement = function(element) {
            var elements = this[_getAttributes](_key).elements;

            var index = elements.indexOf(element);

            if (index !== -1) {
                elements.splice(index, 1);
            }
        };

        /*
            @function refresh

            Refreshes the View (and its Elements) with the specified Model instance.

            @param [{object}] instance      The desired model instance.
        */
        prototype.refresh = function(instance) {
            var attributes = this[_getAttributes](_key);
            var elements = attributes.elements;

            for (var i = 0, length = elements.length; i < length; i++) {
                elements[i].refresh(instance);
            }
        };

        return prototype;
    })(View.prototype || {});

    return View;
});
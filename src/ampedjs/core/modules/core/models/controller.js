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

        Constructs a Controller instance. Note that this does not add the Controller to AmpedJS's internal records.

        @param [{Model[]}] models       The controller's associated model(s)
    */
    var Controller = function(models) {
        //Private instance members
        var attributes = {
            models: models ? (models instanceof Array ? models : [models]) : [],
            actions: []
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
        /*
            @function getModels

            Retrieves the controller's associated models

            @return {Model[]}       The controller's associated models
        */
        prototype.getModels = function() {
            return  this[_getAttributes](_key).models;
        };

        /*
            @function getModel

            Retrieves the main (first) model associated with the controller

            @return {Model}     The main (first) model associated with the controller
        */
        prototype.getModel = function() {
            var models = this[_getAttributes](_key).models;

            return (models.length >= 1 ? models[0] : null);
        };

        /*
            @function getAction

            Retrieves the specified action from the controller

            @param {string} name        The action name

            @return {Action}
        */
        prototype.getAction = function(name) {
            var actions =  this[_getAttributes](_key).actions;

            return actions[name];
        };

        /*
            @function addAction

            Adds the action to the controller

            @param {string} name            The action name
            @param {function} func          The action function
            @param [{object}] options       Additional options for the method
            @param [{View}] options.view    The associated view

        */
        prototype.addAction = function(name, func, options) {
            var actions =  this[_getAttributes](_key).actions;

            actions[name] = {
                function: func,
                view: options ? options.view : null
            };
        };

        /*
            @function removeAction

            Removes the specified action from the controller

            @param {string} name        The action name
        */
        prototype.removeAction = function(name) {
            var actions =  this[_getAttributes](_key).actions;

            delete actions[name];
        };

        return prototype;
    })(Controller.prototype || {});

    return Controller;
});

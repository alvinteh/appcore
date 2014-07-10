define(function(require) {
    "use strict";

    var Model = require("./models/model");
    var FunctionHelper = require("./helpers/function-helper");
    var ModelHelper = require("./helpers/model-helper");

    var _singleton = null;

    var ModelModule = function(App) {
        //Private instance members
        var ModelModule = {
            /*
                @function create

                Creates a Model with the specified attributes, constructor and inheritance. Note that inheritancer and
                return are handled by AmpedJS and the provided constructor does not need to include them.

                @param {string} name                        The desired model name
                @param {string[]} attributes                The desired class attributes
                @param [{object}] options                   Additional options for the method
                @param [{function}] options.constructor     The desired class constructor
                @param [{object}] options.parent            The desired parent class to inherit from

                @return {object}
            */
            create: function(name, attributes, options) {
                var parentClass = options && options.parent ? options.parent : Model;
                var constructor = options && options.hasOwnProperty("constructor") && typeof options.constructor ===
                    "function" ? options.constructor : null;

                //Create the child class constructor. Use a verbose method for performance optimization.
                var childClass;

                if (constructor) {
                    childClass = parentClass === Model ? function() {
                        parentClass.apply(this, [name, attributes]);
                        constructor.apply(this, arguments);

                        return this;
                    } :
                    function() {
                        parentClass.apply(this, arguments);
                        constructor.apply(this, arguments);

                        return this;
                    };
                }
                else {
                    var defaultConstructor = function() {
                        var values = {};

                        if (arguments) {
                            for (var i = 0, length = attributes.length; i < length; i++) {
                                values[attributes[i]] = typeof arguments[i] !== "undefined" ? arguments[i] : null;
                            }
                        }

                        this.set(values);
                    };

                    childClass = parentClass === Model ? function() {
                        parentClass.apply(this, [name, attributes]);
                        defaultConstructor.apply(this, arguments);

                        return this;
                    } :
                    function() {
                        parentClass.apply(this, arguments);
                        defaultConstructor.apply(this, arguments);

                        return this;
                    };
                }

                //Implement inheritance
                childClass.prototype = Object.create(parentClass.prototype);

                //Initialize model methods
                Model.init(name, childClass);

                //Generate getter and setter methods
                var attribute;

                for (var i = 0, length = attributes.length; i < length; i++) {
                    attribute = attributes[i];

                    //jshint -W083
                    (function(attribute) {
                        childClass.prototype[ModelHelper.getGetter(attribute)] = function() {
                            return this.get(attribute);
                        };

                        childClass.prototype[ModelHelper.getSetter(attribute)] = function(value) {
                            this.set(attribute, value);
                            App.View.refresh(this);
                        };
                    })(attributes[i]);
                    //jshint +W083
                }

                childClass.prototype.set = FunctionHelper.override(childClass.prototype.set,
                    function(originalFunction, context, args) {
                    originalFunction.apply(context, args);
                    App.View.refresh(context);
                });

                childClass.prototype.setId = FunctionHelper.override(childClass.prototype.setId,
                    function(originalFunction, context, args) {
                    originalFunction.apply(context, args);
                    App.View.refresh(context);
                });

                return childClass;
            }
        };

        //Public instance members
        return ModelModule;
    };

    return (function() {
        if (_singleton === null || typeof _singleton === "undefined") {
            _singleton = ModelModule;
        }

        return _singleton;
    })();
});

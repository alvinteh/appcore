define(function(require) {
    "use strict";

    var Model = require("./models/model");
    var FunctionHelper = require("./helpers/function-helper");
    var ModelHelper = require("./helpers/model-helper");

    var _singleton = null;

    var ModelModule = function(App) {
        //Public instance members
        var ModelModule = {
            /*
                @function create

                Creates a Model with the specified attributes, constructor and inheritance. Note that inheritancer and
                return are handled by AppCore and the provided constructor does not need to include them.

                @param {string} name                The desired model name
                @param {string[]} attributes        The desired class attributes
                @param [{function}] constructor     The desired class constructor
                @param [{object}] parentClass       The desired parent class to inherit from

                @return {object}
            */
            create: function(name, attributes, constructor, parentClass) {
                parentClass = parentClass ? parentClass : Model;

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
                    childClass = parentClass === Model ? function() {
                        parentClass.apply(this, [name, attributes]);

                        return this;
                    } :
                    function() {
                        parentClass.apply(this, arguments);

                        return this;
                    };
                }

                //Implement inheritance
                childClass.prototype = Object.create(parentClass.prototype);

                //Initialize model methods
                Model.init(childClass);

                //Generate getter and setter methods
                for (var i = 0, length = attributes.length; i < length; i++) {
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

                childClass.prototype.setId = FunctionHelper.override(childClass.prototype.setId,
                    function(originalFunction, context, args) {
                    originalFunction.apply(context, args);
                    App.View.refresh(context);
                });

                return childClass;
            }
        };

        return ModelModule;
    };

    return (function() {
        if (_singleton === null || _singleton === undefined) {
            _singleton = ModelModule;
        }

        return _singleton;
    })();
});
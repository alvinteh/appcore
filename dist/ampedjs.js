/*!  ampedjs 0.1.0 | 2014 Alvin Teh */
define('core/modules/core/helpers/uuid-helper',[],function() {
    

    var UuidHelper = (function() {
        return {
            /*
                @function generateUuid()

                Generates a UUID.

                @param {boolean = true} stripDashes     Flag indicating whether dashes should be stripped.

                @return {string}
            */
            generateUuid: function(stripDashes) {
                var string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

                if (typeof stripDashes === "undefined" || stripDashes === true) {
                    string = string.replace(/\-/g, "");
                }

                return string.replace(/[xy]/g, function(c) {
                    var r = Math.random() * 16 | 0;
                    var v = c === "x" ? r : (r & 0x3 | 0x8);

                    return v.toString(16);
                });
            }
        };
    })();

    return UuidHelper;
});

define('core/modules/core/models/controller',['require','../helpers/uuid-helper'],function(require) {
    

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

            @return {object}
        */
        prototype.getAction = function(name) {
            var actions = this[_getAttributes](_key).actions;

            return actions[name];
        };

        /*
            @function getActions

            Retrieves the controller's actions

            @return {object[]}
        */
        prototype.getActions = function() {
            return this[_getAttributes](_key).actions;
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

define('core/modules/core/core.controller',['require','./models/controller'],function(require) {
    

    var Controller = require("./models/controller");

    var _singleton = null;

    var ControllerModule = function() {
        //Private instance members
        var controllers = [];

        var ControllerModule = {
            /*
                @function add

                Adds the specified controller to the internal records.

                @param {Controller} controller        The desired controller
            */
            add: function(controller) {
                //Ignore views which already exist in the internal records
                if (controllers.indexOf(controller) !== -1) {
                    return;
                }

                controllers.push(controller);
            },

            /*
                @function remove

                Removes the specified controller from the internal records.

                @param {Controller} controller        The desired controller
            */
            remove: function(controller) {
                var index = controllers.indexOf(controller);

                if (index !== -1) {
                    controllers.splice(index, 1);
                }
            },

            /*
                @function has

                Checks whether the specified controller exists in the internal records.

                @param {Controller} controller        The desired controller
            */
            has: function(controller) {
                return controllers.indexOf(controller) !== -1;
            },

            /*
                @function create

                Creates a Controller instance and adds it to the internal records.

                @param [{Model[]}] models       The controller's associated model(s)
            */
            create: function(models) {
                var controller = new Controller(models);

                controllers.push(controller);

                return controller;
            },

            Controller: Controller
        };

        //Public instance members
        return ControllerModule;
    };

    return (function() {
        if (_singleton === null || typeof _singleton === "undefined") {
            _singleton = ControllerModule;
        }

        return _singleton;
    })();
});

define('core/modules/core/helpers/model-helper',[],function() {
    

    var ModelHelper = (function() {
        return {
            /*
                @function getGetter

                Gets the name of the getter method of the specified attribute.

                @param {string} attribute       The desired attribute

                @return {string}
            */
            getGetter: function(attribute) {
                return "get" + attribute.charAt(0).toUpperCase() + attribute.substring(1);
            },

            /*
                @function getSetter

                Gets the name of the setter method of the specified attribute.

                @param {string} attribute       The desired attribute

                @return {string}
            */
            getSetter: function(attribute) {
                return "set" + attribute.charAt(0).toUpperCase() + attribute.substring(1);
            },

            /*
                @function generateGettersSetters

                Generates getters and setters for the specified prototype and attributes

                @param {object} prototype       The desired prototype
                @param [{string}] attributes    The desired attributes
            */
            generateGettersSetters: function(prototype, attributes) {
                for (var i = 0, length = attributes.length; i < length; i++) {
                    //jshint -W083
                    (function(attribute) {
                        prototype[ModelHelper.getGetter(attribute)] = function() {
                            return this.get(attribute);
                        };

                        prototype[ModelHelper.getSetter(attribute)] = function(value) {
                            this.set(attribute, value);
                        };
                    })(attributes[i]);
                    //jshint +W083
                }
            }
        };
    })();

    return ModelHelper;
});
define('core/modules/core/models/event',['require','../helpers/model-helper','../helpers/uuid-helper'],function(require) {
    

    var ModelHelper = require("../helpers/model-helper");
    var UuidHelper = require("../helpers/uuid-helper");

    var _key = {};
    var _getAttributes = UuidHelper.generateUuid();

    /*
        @class Event

        @classdesc Event class.
    */

    /*
        @constructor Event

        Constructs an Event instance.

        @param {string} name        The desired name
        @param {object} target      The desired event target
        @param [{object}] data      The desired event data
    */
    var Event = function(target, name, data) {
        //Private instance members
        var attributes = {
            target: target,
            name: name,
            data: data
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

    Event.prototype = (function(prototype) {
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
            @function set

            Sets the specified attribute.

            @param {string|object} attribute        The desired attribute OR attribute-value dictionary
            @param {mixed} value                    The desired value
        */
        prototype.set = function(attribute, value) {
            if (typeof value !== "undefined") {
                this[_getAttributes](_key)[attribute] = value;
            }
            else {
                for (var key in attribute) {
                    this[_getAttributes](_key)[key] = attribute[key];
                }
            }
        };

        //Generate getter and setter methods
        ModelHelper.generateGettersSetters(prototype, ["target", "name", "data"]);

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
    })(Event.prototype || {});

    return Event;
});

define('core/modules/core/helpers/event-helper',[],function() {
    

    var EventHelper = (function() {
        /*
            Array to store all event listeners. Adheres to the following format:

            [
                {
                    object
                    events: {
                        event1: [
                            {
                                func
                                type
                            }
                        ]
                    }
                }
            ]
        */
        var data = [];

        return {
            /*
                @function observe

                Observes the specified target for the specified event such that the specified event listener is called
                when the aforementioned event fires.

                @param {object} target                  The desired object to be observed
                @param {string} event                   The desired event to be observed
                @param {function} eventListener         The desired event listener
            */
            observe: function(target, event, eventListener) {
                //Find or create object record
                var objectRecord;

                for (var i = 0, length = data.length; i < length; i++) {
                    if (data[i].object === target) {
                        objectRecord = data[i];
                    }
                }

                if (!objectRecord) {
                    var objectRecordTemplate = {
                        object: target,
                        events: {}
                    };
                    data.push(objectRecordTemplate);
                    objectRecord = objectRecordTemplate;
                }

                //Find or create event record
                var eventRecord = objectRecord.events[event];

                if (!eventRecord) {
                    var eventRecordTemplate = [];
                    objectRecord.events[event] = eventRecordTemplate;
                    eventRecord = eventRecordTemplate;
                }

                eventRecord.push({
                    func: eventListener,
                    type: "intra"
                });
            },

            /*
                @function unobserve

                Stops observing the specified target for the specified and specified event listener.

                @param {object} target                  The desired object to stop observing
                @param {string} event                   The desired event to stop observing
                @param [{function}] eventListener       The desired event listener
            */
            unobserve: function(target, event, eventListener) {
                for (var i = 0, iLength = data.length; i < iLength; i++) {
                    var objectRecord = data[i];

                    if (objectRecord.object !== target) {
                        continue;
                    }

                    var eventListenerRecords = objectRecord.events[event];

                    if (!eventListenerRecords) {
                        return;
                    }

                    for (var j = eventListenerRecords.length - 1; j >= 0; j--) {
                        if (eventListenerRecords[j].func === eventListener || typeof eventListener === "undefined") {
                            eventListenerRecords.splice(j, 1);
                        }
                    }

                    break;
                }
            },

            /*
                @function trigger

                Triggers the specified Event.

                @param {object} target      The desired Event
            */
            trigger: function(event) {
                for (var i = 0, iLength = data.length; i < iLength; i++) {
                    var objectRecord = data[i];

                    if (objectRecord.object !== event.getTarget()) {
                        continue;
                    }

                    var eventListenerRecords = objectRecord.events[event.getName()];

                    if (!eventListenerRecords) {
                        return;
                    }

                    for (var j = 0, jLength = eventListenerRecords.length; j < jLength; j++) {
                        eventListenerRecords[j].func(event);
                    }

                    break;
                }
            }
        };
    })();

    return EventHelper;
});

define('core/modules/core/core.event',['require','./models/event','./helpers/event-helper'],function(require) {
    

    var Event = require("./models/event");
    var EventHelper = require("./helpers/event-helper");

    var _singleton = null;

    var EventModule = function() {
        //Private instance members
        var EventModule = {
            /*
                @function observe

                Observes the specified target for the specified event such that the specified event listener is called
                when the aforementioned event fires.

                @param {object} target                  The desired object to be observed
                @param {string} event                   The desired event to be observed
                @param {function} eventListener         The desired event listener
            */
            observe: EventHelper.observe,

            /*
                @function unobserve

                Stops observing the specified target for the specified and specified event listener.

                @param {object} target                  The desired object to stop observing
                @param {string} event                   The desired event to stop observing
                @param {function} eventListener         The desired event listener
            */
            unobserve: EventHelper.unobserve,

            /*
                @function trigger

                Triggers the specified Event.

                @param {object} target      The desired Event
            */
            trigger: EventHelper.trigger,

            Event: Event
        };

        //Public instance members
        return EventModule;
    };

    return (function() {
        if (_singleton === null || typeof _singleton === "undefined") {
            _singleton = EventModule;
        }

        return _singleton;
    })();
});

define('core/modules/core/models/helper',[],function() {
    

    /*
        @abstract
        @class Helper

        @classdesc Helper class.
    */

    /*
        @constructor Helper

        Constructs a Helper instance.
    */
    var Helper = function() {};

    //Public instance members
    /*
        @function addStaticMethod

        Adds the specified method to the specified helper.

        @param {object} helper       The desired helper
        @param {string} name        The desired method name
        @param {string} method      The desired method
    */
    Helper.addStaticMethod = function(helper, name, method) {
        helper[name] = method;
    };

    /*
        @function removeStaticMethod

        Removes the specified method from the specified helper.

        @param {object} helper       The desired helper
        @param {string} name        The desired method name
    */
    Helper.removeStaticMethod = function(helper, name) {
        delete helper[name];
    };

    /*
        @function hasStaticMethod

        Checks if the specified method exists in the specified helper.

        @param {object} helper       The desired helper
        @param {string} name        The desired method name

        @return {boolean}
    */
    Helper.hasStaticMethod = function(helper, name) {
        return typeof helper[name] === "function" && typeof helper.prototype[name] !== "function";
    };

    return Helper;
});

define('core/modules/core/core.helper',['require','./models/helper'],function(require) {
    

    var Helper = require("./models/helper");

    var _singleton = null;

    var HelperModule = function() {
        //Private instance members
        var HelperModule = {
            /*
                @function create

                Creates a Helper.

                @return {Helper}
            */
            create: function() {
                //Create the child class constructor. Use a verbose method for performance optimization.
                var childClass = {};

                //Implement inheritance
                childClass.prototype = Object.create(Helper.prototype);

                //Implement method manipulation methods
                childClass.addStaticMethod = function(name, method) {
                    Helper.addStaticMethod(childClass, name, method);
                };

                childClass.removeStaticMethod = function(name) {
                    Helper.removeStaticMethod(childClass, name);
                };

                childClass.hasStaticMethod = function(name) {
                    return Helper.hasStaticMethod(childClass, name);
                };

                return childClass;
            }
        };

        //Public instance members
        return HelperModule;
    };

    return (function() {
        if (_singleton === null || typeof _singleton === "undefined") {
            _singleton = HelperModule;
        }

        return _singleton;
    })();
});

define('core/modules/core/helpers/string-helper',[],function() {
    

    var StringHelper = (function() {
        return {
            /*
                @function convertToCamelCase

                Converts the specified snake-cased string to camel case.

                @param {string} string      The desired string

                @return {string}
            */
            convertToCamelCase: function(string) {
                return string.replace(/(\_\w)/g, function($1) { return $1[1].toUpperCase(); });
            },

            /*
                @function convertToSnakeCase

                Converts the specified camel-cased string to snake case.

                @param {string} string      The desired string

                @return {string}
            */
            convertToSnakeCase: function(string) {
                var ret = string.replace(/([A-Z])/g, function($1) { return "_" + $1.toLowerCase(); });

                if (ret.charAt(0) === "_") {
                    ret = ret.substring(1, 2).toLowerCase() + ret.substring(2);
                }

                return ret;
            },

            /*
                @function lowercaseFirst

                Converts the first character of the string to lower case.

                @param {string} string      The desired string

                @return {string}
            */
            lowercaseFirst: function(string) {
                return string.charAt(0).toLowerCase() + string.substring(1);
            },

            /*
                @function uppercaseFirst

                Converts the first character of the string to upper case.

                @param {string} string      The desired string

                @return {string}
            */
            uppercaseFirst: function(string) {
                return string.charAt(0).toUpperCase() + string.substring(1);
            },

            /*
                @function humanize

                Converts the string to a "human format", replacing underscores/uppercase characters.

                @param {string} string      The desired string

                @return {string}
            */
            humanize: function(string) {
                return string.replace(/([A-Z])/g, function($1) { return " " + $1.toLowerCase(); })
                    .replace(/_/g, " ");
            }
        };
    })();

    return StringHelper;
});

define('core/modules/core/models/model',['require','../models/event','../helpers/event-helper','../helpers/string-helper','../helpers/uuid-helper'],function(require) {
    

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

define('core/modules/core/helpers/function-helper',[],function() {
    

    var FunctionHelper = (function() {
        return {
            /*
                @function override

                Creates a blank function.

                @return {function}
            */
            noop: function() {
            },

            /*
                @function override

                Gets an overriden version of the specified function. The overriding function will be passed references
                to the original function, its scope and arguments so that the latter function can be called by running
                originalFunction.apply(scope, arguments);

                @param {function} originalFunction      The desired original function
                @param {function} overridingFunction    The desired overriding function

                @return {function}
            */
            override: function(originalFunction, overridingFunction) {
                return function() {
                    overridingFunction(originalFunction, this, arguments);
                };
            }
        };
    })();

    return FunctionHelper;
});
define('core/modules/core/core.model',['require','./models/model','./helpers/function-helper','./helpers/model-helper'],function(require) {
    

    var Model = require("./models/model");
    var FunctionHelper = require("./helpers/function-helper");
    var ModelHelper = require("./helpers/model-helper");

    var _singleton = null;

    var ModelModule = function(Am) {
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
                            Am.View.refresh(this);
                        };
                    })(attributes[i]);
                    //jshint +W083
                }

                childClass.prototype.set = FunctionHelper.override(childClass.prototype.set,
                    function(originalFunction, context, args) {
                    originalFunction.apply(context, args);
                    Am.View.refresh(context);
                });

                childClass.prototype.setId = FunctionHelper.override(childClass.prototype.setId,
                    function(originalFunction, context, args) {
                    originalFunction.apply(context, args);
                    Am.View.refresh(context);
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

define('core/modules/core/models/module',[],function() {
    

    /*
        @class Module

        @classdesc Module class.
    */

    /*
        @constructor Module

        Constructs a Module instance.

        @param {string} name                The desired name
        @param {object[]} components        The desired components
    */
    var Module = function(components) {
        //Private instance members
        //(None)

        //Public instance members
        for (var componentName in components) {
            this[componentName] = components[componentName];
        }

        //Return instance
        return this;
    };

    return Module;
});
define('core/modules/core/models/promise',['require','../helpers/uuid-helper'],function(require) {
    

    var UuidHelper = require("../helpers/uuid-helper");

    var _key = {};
    var _getAttributes = UuidHelper.generateUuid();

    /*
        @class Promise

        @classdesc Promise class.
    */

    var STATE = {
        UNFULFILLED: 0,
        FULFILLED: 1,
        REJECTED: 2
    };

    /*
        @constructor Promise

        Constructs a Promise instance.
    */
    var Promise = function(func) {
        //Private instance members
        var attributes = {
            state: STATE.UNFULFILLED,
            queue: [],
            value: null
        };

        //Public instance members
        //(None)

        //Special instance method for private member access
        this[_getAttributes] = function(key) {
            if (key === _key) {
                return attributes;
            }
        };

        //Other steps
        var me = this;

        if (func) {
            func(function(value) {
                me.resolve(value);
            }, function(error) {
                me.transition(STATE.REJECTED, error);
            });
        }

        //Return instance
        return this;
    };

    //Public prototype members
    Promise.prototype = (function(prototype) {
        /*
            @function run

            Processes the desired promise's queue.

            @param {object} promise     The desired promise
        */
        var run = function(promise) {
            if (promise.get("state") === STATE.UNFULFILLED) {
                return;
            }

            setTimeout(function() {
                var queue = promise.get("queue");

                while (queue.length > 0) {
                    var object = queue.shift();
                    var value;

                    try {
                        //jshint -W083
                        value = (promise.get("state") === STATE.FULFILLED ?
                            (object.fulfill || function(x) { return x; }) :
                            (object.reject || function(x) { throw x; }))(promise.get("value"));
                        //jshint +W083
                    }
                    catch (e) {
                        object.promise.transition(STATE.REJECTED, e);
                        continue;
                    }
                    object.promise.resolve(value);
                }
            }, 0);
        };


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
            @function transition

            Transitions the promise to the desired state.

            @param {int} state          The desired state
            @param {mixed} value        The desired value
        */
        prototype.transition = function(state, value) {
            var currentState = this.get("state");

            if (currentState === state || currentState !== STATE.UNFULFILLED || typeof value === "undefined" ||
                (state !== STATE.FULFILLED && state !== STATE.REJECTED) ||
                arguments.length < 2) {
                return false;
            }

            var attributes = this[_getAttributes](_key);
            attributes.state = state;
            attributes.value = value;

            run(this);
        };

        /*
            @function then

            Returns a new Promise with the desired callbacks.

            @param {function} fulfillCallback       The desired fulfill callback
            @param [{function}] rejectCallback      The desired reject callback

            @return {object}
        */
        prototype.then = function(fulfillCallback, rejectCallback) {
            var promise = new Promise();
            var queue = this.get("queue");

            queue.push({
                fulfill: typeof fulfillCallback === "function" && fulfillCallback,
                reject: typeof rejectCallback === "function" && rejectCallback,
                promise: promise
            });

            run(this);

            return promise;
        };

        /*
            @function resolve

            Resolves the promise with the desired value.

            @param {mixed} x        The desired value or promise
        */
        prototype.resolve = function(x) {
            if (this === x) {
                this.transition(STATE.REJECTED, new Error("Illegal promise self-resolution."));
            }
            else if (x && x instanceof Promise) {
                if (x.get("state") === STATE.UNFULFILLED) {
                    var me = this;
                    x.then(function(value) {
                        me.resolve(value);
                    }, function(error) {
                        me.transition(STATE.REJECTED, error);
                    });
                }
                else {
                    this.transition(x.get("state"), x.get("value"));
                }
            }
            else if ((typeof x === "object" || typeof x === "function") && x !== null) {
                var called = false;

                var then = x.then;

                if (typeof then === "function") {
                    var promise = this;
                    then.call(x, function(y) {
                        if (!called) {
                            promise.resolve(y);
                        }
                        called = true;
                    }, function(r) {
                        if (!called) {
                            promise.transition(STATE.REJECTED, r);
                        }
                        called = true;
                    });
                }
                else {
                    this.transition(STATE.FULFILLED, x);
                }
            }
            else {
                this.transition(STATE.FULFILLED, x);
            }
        };

        /*
            @function reject

            Rejects the promise with the desired error.

            @param {mixed} error    The desired error
        */
        prototype.reject = function(error) {
            this.transition(STATE.REJECTED, error);
        };

        return prototype;
    })(Promise.prototype || {});

    //Static members
    /*
        @function convert

        Converts the specified function (assuming its signature follows the format func(errorCallback, successCallback,
        value) to use promises).

        @param {mixed} func     The desired function
    */
    Promise.convert = function(func) {
        return function() {
            var context = this;
            var args = [].slice.call(arguments);

            return new Promise(function(fulfillCallback, rejectCallback) {
                func.apply(context, [rejectCallback, fulfillCallback].concat(args));
            });
        };
    };

    return Promise;
});

define('core/modules/core/core.module',['require','./models/module','./models/promise'],function(require) {
    

    var Module = require("./models/module");
    var Promise = require("./models/promise");

    var _singleton = null;

    var ModuleModule = function() {
        //Private instance members
        var modules = {};

        var ModuleModule = {
            /*
                @function create

                Creates a Module.

                @param {string} name                The desired Module name.
                @param {object[]} components        The desired components

                @return {Module}
            */
            create: function(name, components) {
                //Create the module.
                var module = new Module(components);
                modules[name] = module;

                return module;
            },

            /*
                @function get

                Gets the specified Module.

                @param {string} name        The desired Module name.

                @return {Module}
            */
            get: function(name) {
                return modules[name];
            },

            /*
                @function load

                Loads the specified Module.

                @param {string|string[]} name       The desired Module name.

                @return {Promise}
            */
            load: function(name) {
                var normalizedModules = ["module"];

                var processModule = function(module) {
                    var moduleParts = module.split(".");
                    var moduleType = moduleParts.length === 1 ? "core" : moduleParts[1];
                    var moduleName = moduleParts[moduleParts.length === 1 ? 0 : 1].toLowerCase();

                    var moduleUrl = "../../../" + moduleType + "/modules/" + moduleName + "/" + moduleName;

                    normalizedModules.push(moduleUrl);
                };

                if (typeof name === "string") {
                    processModule(name);
                }
                else {
                    for (var i = 0, length = name.length; i < length; i++) {
                        processModule(name[i]);
                    }
                }

                return new Promise(function(resolve, reject) {
                    require(normalizedModules,
                        function() {
                            var modules = {};

                            if (typeof name === "string") {
                                modules = ModuleModule.get(name);
                            }
                            else {
                                for (var i = 0, length = name.length; i < length; i++) {
                                    modules[name[i]] = ModuleModule.get(name[i]);
                                }
                            }

                            resolve(modules);
                        },
                        function(error) {
                            reject(error);
                        }
                    );
                });
            }
        };

        //Public instance members
        return ModuleModule;
    };

    return (function() {
        if (_singleton === null || typeof _singleton === "undefined") {
            _singleton = ModuleModule;
        }

        return _singleton;
    })();
});

define('core/modules/core/core.route',['require','./models/event','./helpers/event-helper'],function(require) {
    

    var Event = require("./models/event");
    var EventHelper = require("./helpers/event-helper");

    var _singleton = null;

    var RouteModule = function() {
        //Private instance members
        /*
            Array of routes. Adheres to the following format:

            [
                {
                    path,
                    controller,
                    action,
                    inferred
                }
            ]
        */
        var baseUrl;
        var routes = [];
        var currentPath = null;

        var getRouteMatches = function(requestPath, routePath) {
            var routePathRegex = new RegExp(routePath.replace(/:[^\s/]+/g, "([\\w-]+)"));
            return requestPath.match(routePathRegex);
        };

        var processRoute = function(requestPath) {
            currentPath = "/";

            for (var i = 0, length = routes.length; i < length; i++) {
                var route = routes[i];
                var matches = getRouteMatches(requestPath, route.path);

                if (matches !== null) {
                    var action = route.controller.getAction(route.action);

                    currentPath = requestPath;

                    //Raise enter event on route's action's view if applicable
                    if (action.view !== null) {
                        EventHelper.trigger(new Event(action.view, "enter", { path: currentPath }));
                    }

                    //Execute the action function
                    matches.shift();
                    action.function.apply(route.controller, matches);

                    break;
                }
            }
        };

        var RouteModule = {
            /*
                @function isBound

                Checks if the specified path is bound to any routes

                @param {string} path        The desired path
            */
            isBound: function(path) {
                for (var i = 0, length = routes.length; i < length; i++) {
                    if (getRouteMatches(path, routes[i].path) !== null) {
                        return true;
                    }
                }

                return false;
            },

            /*
                @function getBaseUrl

                Retrieves the base URL
            */
            getBaseUrl: function() {
                return baseUrl;
            },

            /*
                @function setBaseUrl

                @param {string} url     The desired base URL

                Sets the base URL
            */
            setBaseUrl: function(url) {
                baseUrl = url;
            },

            /*
                @function bind

                Binds the specified path to the specified controller (and, if applicable, action). Use colons to denote
                parameters (e.g. /users/:id/posts/:postId will match /users/1/posts/2).

                @param {string} path                The desired path
                @param {Controller} controller      The desired controller
                @param [{string}] action            The desired controller's action
            */
            bind: function(path, controller, action) {
                var newRoutes = [];
                var normalizedPath = path;

                //Normalize the path to ensure it begins with a "/" and ends without a "/")
                if (normalizedPath !== "/") {
                    if (normalizedPath.charAt(0) !== "/") {
                        normalizedPath = "/" + normalizedPath;
                    }
                    if (normalizedPath.lastIndexOf("/") === normalizedPath.length - 1) {
                        normalizedPath = normalizedPath.substring(0, normalizedPath.length - 1);
                    }
                }

                //Determine the route entries to be added
                if (typeof action === "undefined") {
                    //Infer routes based on the controller's actions' names
                    var actions = controller.getActions();

                    for (var actionName in actions) {
                        newRoutes.push({
                            path: normalizedPath + "/" + actionName,
                            controller: controller,
                            action: actionName,
                            inferred: true
                        });
                    }
                }
                else {
                    newRoutes.push({
                        path: normalizedPath,
                        controller: controller,
                        action: action,
                        inferred: false,
                    });
                }

                //Add the route entries
                newRoutes.forEach(function(newRoute) {
                    var shouldSkip = false;
                    //Check if the route exists
                    for (var i = 0, length = routes.length; i < length; i++) {
                        if (routes[i].path === newRoute.path) {
                            if (newRoute.inferred && !routes[i].inferred) {
                                shouldSkip = true;
                            }
                            else {
                                //Remove the old route so that it can be overriden
                                routes.splice(i, 1);
                            }
                            break;
                        }
                    }

                    if (!shouldSkip) {
                        routes.push(newRoute);
                    }
                });
            },

            /*
                @function unbind

                Unbinds the specified path, including child paths if the cascade.

                @param {string} path            The desired path
                @param {boolean} cascade        Flag indicating whether the operation should cascade to child paths
            */
            unbind: function(path, cascade) {
                cascade = cascade === true;
                var normalizedPath = path;

                //Normalize the route to ensure it begins with a "/" and ends without a "/")
                if (normalizedPath.length !== "/") {
                    if (normalizedPath.charAt(0) !== "/") {
                        normalizedPath = "/" + normalizedPath;
                    }
                    if (normalizedPath.lastIndexOf("/") === normalizedPath.length - 1) {
                        normalizedPath = normalizedPath.substring(0, normalizedPath.length - 1);
                    }
                }


                for (var i = routes.length - 1; i >= 0; i--) {
                    if (routes[i].path === normalizedPath ||
                        (cascade &&
                        routes[i].path.indexOf(normalizedPath === "/" ? "/" : normalizedPath + "/") === 0)) {
                        routes.splice(i, 1);
                    }
                }
            },

            /*
                @function go

                Navigates to the specified path

                @param {string} path        The desired path

            */
            go: function(path) {
                if (RouteModule.isBound(currentPath)) {
                    for (var i = 0, length = routes.length; i < length; i++) {
                        //Raise leave event on current route's action's view if applicable
                        if (getRouteMatches(currentPath, routes[i].path) !== null) {
                            var view = routes[i].action.view;

                            if (view !== null) {
                                EventHelper.trigger(new Event(view, "leave", { path: currentPath }));
                            }
                        }
                    }
                }

                if (path === "/") {
                    currentPath = "/";
                    history.pushState(null, null, RouteModule.getBaseUrl());
                }
                else {
                    history.pushState(null, null, RouteModule.getBaseUrl() + path.substring(1));
                    processRoute(path);
                }
            }
        };

        //Determine default base URL
        baseUrl = window.location.href;

        //Remove any hashes first
        if (baseUrl.substr(baseUrl.length - 1) === "#") {
            baseUrl = baseUrl.substr(0, baseUrl.length - 1);
        }

        //Handle file names at the end of URLs
        if (baseUrl.substr(baseUrl.length - 1) !== "/") {
            baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf("/")) + "/";
        }

        //Listen for changes in history state so that the route can be processed
        window.addEventListener("popstate", function() {
            if (RouteModule.isBound(currentPath)) {
                for (var i = 0, length = routes.length; i < length; i++) {
                    //Raise leave event on current route's action's view if applicable
                    if (getRouteMatches(currentPath, routes[i].path)) {
                        var view = routes[i].controller.getAction(routes[i].action).view;

                        if (view !== null) {
                            EventHelper.trigger(new Event(view, "leave", { path: currentPath }));
                        }
                    }
                }
            }

            //Process the route if it is within the path of the base URL
            if (window.location.href.indexOf(baseUrl) === 0) {
                processRoute(window.location.href.substring(baseUrl.length));
            }
        });

        //Public instance members
        return RouteModule;
    };

    return (function() {
        if (_singleton === null || typeof _singleton === "undefined") {
            _singleton = RouteModule;
        }

        return _singleton;
    })();
});

define('core/modules/core/models/element',['require','../helpers/uuid-helper'],function(require) {
    

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

define('core/modules/core/models/view',['require','../models/event','../helpers/event-helper','../helpers/uuid-helper'],function(require) {
    

    var Event = require("../models/event");
    var EventHelper = require("../helpers/event-helper");
    var UuidHelper = require("../helpers/uuid-helper");

    var _key = {};
    var _getAttributes = UuidHelper.generateUuid();

    /*
        @class View

        @classdesc View class.
    */

    /*
        @constructor View

        Constructs a View instance. Note that this does not add the View to AmpedJS's internal records.

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
                var isChild = (function(parent, child) {
                    var node = child.parentNode;

                    while (node !== null) {
                        if (node === parent) {
                            return true;
                        }

                        node = node.parentNode;
                    }
                    return false;
                })(this[_getAttributes](_key).containerElement, element.getElement());

                if (isChild) {
                    elements.push(element);
                }
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
            @function hasElement

            Checks whether the specified Element exists in the View.
        */
        prototype.hasElement = function(element) {
            var elements = this[_getAttributes](_key).elements;

            return elements.indexOf(element) !== -1;
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

        return prototype;
    })(View.prototype || {});

    return View;
});

define('core/modules/core/core.view',['require','./models/element','./models/view','./helpers/function-helper'],function(require) {
    

    var Element = require("./models/element");
    var View = require("./models/view");
    var FunctionHelper = require("./helpers/function-helper");

    var _singleton = null;

    var ViewModule = function() {
        //Private instance variables
        //Initialize events
        /*
            Array of event listeners. Adheres to the following format:

            [
                {
                    element,
                    event,
                    listener
                }
            ]
        */
        var eventListeners = [];
        var views = [];

        var handleNormalEventListeners = function(event) {
            var eventListener;

            for (var i = 0, length = eventListeners.length; i < length; i++) {
                eventListener = eventListeners[i];

                if (eventListener.element === event.target && eventListener.event === event.type) {
                    eventListener.listener.apply(undefined, [event]);
                }
            }
        };

        var handleMutationEventListeners = function(event) {
            var eventListener;

            for (var i = 0, length = eventListeners.length; i < length; i++) {
                eventListener = eventListeners[i];

                if (eventListener.event === "mutation") {
                    if (eventListener.element === event.target ||
                        (event.type === "characterData" && eventListener.element === event.target.parentElement)) {
                        eventListener.listener.apply(undefined, [event]);
                    }
                }
            }
        };

        var events = ["blur", "change", "click", "focus", "input", "keypress", "keyup", "mousedown", "mouseup",
        "mouseenter", "mouseleave", "mouseover", "mouseout", "pause", "play", "ratechange", "seeked", "volumechange"];

        for (var i  = 0, iLength = events.length; i < iLength; i++) {
            document.addEventListener(events[i], handleNormalEventListeners);
        }

        //Monitor DOM for changes
        //NOTE: A polyfill (not provided) is required for this to work IE 9 and 10
        //NOTE: IE11 incorrectly reports characterData changes in child nodes as childList mutations
        if (window.MutationObserver || window.WebkitMutationObserver) {
            var mutationObserver = new window[(window.MutationObserver ? "" : "WebKit") + "MutationObserver"](
                function(mutations) {

                mutations.forEach(function(mutation) {
                    handleMutationEventListeners(mutation);
                });
            });

            mutationObserver.observe(window.document.querySelector("body"), {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true
            });
        }

        Element.prototype.addDataBinding = FunctionHelper.override(Element.prototype.addDataBinding,
            function(originalFunction, context, args) {

            originalFunction.apply(context, args);

            var instance = args[0];
            var objectProperty = args[1];
            var options = args[2];
            var elementProperties = (function(elementProperties) {
                if (typeof elementProperties === "undefined") {
                    return (typeof context.getElements()[0].value === "undefined" ? ["innerHTML"] : ["value"]);
                }
                else {
                    return elementProperties instanceof Array ? elementProperties : [elementProperties];
                }
            })(options ? options.elementProperties : undefined);
            var direction = args[2] && typeof options.direction !== "undefined" ?
                options.direction : Element.TWO_WAY_BINDING;

            if (direction === Element.ONE_WAY_BINDING) {
                return;
            }

            var events = ["change", "input"];

            var elements = context.getElements();
            var element, value;
            var backwardTransform = args[2] ? args[2].backwardTransform : null;

            for (var i = 0, iLength = elements.length; i < iLength; i++) {
                element = elements[i];

                //jshint -W083
                if (elementProperties.indexOf("value") !== -1) {
                    for (var j = 0, jLength = events.length; j < jLength; j++) {
                        eventListeners.push({
                            element: element,
                            event: events[j],
                            listener: function() {
                                value = element.value;

                                if (backwardTransform) {
                                    value = backwardTransform(value);
                                }

                                instance.set(objectProperty, value);
                                ViewModule.refresh(instance);
                            }
                        });
                    }
                }
                else {
                    eventListeners.push({
                        element: element,
                        event: "mutation",
                        listener: function(mutation) {
                            if (mutation.type === "attributes") {
                                if (elementProperties.indexOf(mutation.attributeName) !== -1) {
                                    if (mutation.attributeName.indexOf("data-") === 0) {
                                        value = element.dataset[mutation.attributeName.substring(5)];
                                    }
                                    else {
                                        value = element[mutation.attributeName];
                                    }

                                    if (backwardTransform) {
                                        value = backwardTransform(value);
                                    }

                                    instance.set(objectProperty, value);
                                    ViewModule.refresh(instance);
                                }
                            }
                            else if (mutation.type === "characterData" || mutation.type === "childList") {
                                if (elementProperties.indexOf("innerHTML") !== -1) {
                                    value = element.innerHTML;

                                    if (backwardTransform) {
                                        value = backwardTransform(value);
                                    }

                                    instance.set(objectProperty, value);
                                    ViewModule.refresh(instance);
                                }
                            }
                        }
                    });
                }
                //jshint +W083
            }
        });

        Element.prototype.removeDataBinding = FunctionHelper.override(Element.prototype.removeDataBinding,
            function(originalFunction, context, args) {

            originalFunction.apply(context, args);

            var options = args[2];
            var elementProperties = options ? options.elementProperties : undefined;
            var direction = options ? options.direction : undefined;

            if (direction === Element.ONE_WAY_BINDING) {
                return;
            }

            var events = ["change", "input"];

            var elements = context.getElements();
            var element, eventListener;

            for (var i = 0, iLength = elements.length; i < iLength; i++) {
                element = elements[i];

                //jshint -W083
                if ((typeof elementProperties === "undefined" && typeof context.getElements()[0].value !==
                    "undefined") || (typeof elementProperties !== "undefined" && elementProperties.indexOf("value") !==
                    -1)) {
                    for (var j = 0, jLength = events.length; j < jLength; j++) {
                        for (var k = 0, kLength = eventListeners.length; k < kLength; k++) {
                            eventListener = eventListeners[k];

                            if (eventListener.element === element && events.indexOf(eventListener.event) !== -1) {
                                eventListeners.splice(k, 1);
                                k--;
                                kLength--;
                            }
                        }
                    }
                }
                else {
                    for (var l = 0, lLength = eventListeners.length; l < lLength; l++) {
                        eventListener = eventListeners[l];

                        if (eventListener.element === element && events.indexOf(eventListener.event) !== -1) {
                            eventListeners.splice(l, 1);
                            l--;
                            lLength--;
                        }
                    }
                }
                //jshint +W083
            }
        });

        var ViewModule = {
            /*
                @function add

                Adds the specified view to the internal records.

                @param {object} view        The desired view
            */
            add: function(view) {
                //Ignore views which already exist in the internal records
                if (views.indexOf(view) !== -1) {
                    return;
                }

                views.push(view);
            },

            /*
                @function remove

                Removes the specified view to the internal records.

                @param {object} view        The desired view
            */
            remove: function(view) {
                var index = views.indexOf(view);

                if (index !== -1) {
                    views.splice(index, 1);
                }
            },

            /*
                @function has

                Checks whether the specified view exists in the internal records.

                @param {object} view        The desired view
            */
            has: function(view) {
                return views.indexOf(view) !== -1;
            },

            /*
                @function create

                Creates a View instance and adds it to the internal records.

                @param [htmlElement[]|htmlElement|string] elements      The desired HTML element(s)
            */
            create: function(elements) {
                var view = new View(elements);

                views.push(view);

                return view;
            },

            /*
                @function refresh

                Refreshes all views which are data bound to the specified model instance. Generally speaking, this is
                automatically called by AmpedJS.

                @param [{object}] instance      The desired model instance.
            */
            refresh: function(instance) {
                for (var i = 0, length = views.length; i < length; i++) {
                    views[i].refresh(instance);
                }
            },

            Element: (function() {
                return {
                    /*
                        @function create

                        Creates an Element instance and optionally adds it to the specified View.

                        @param [{HTMLElement[]|HTMLElement|string}] elements        The desired HTML element(s)
                        @param [View] view                                          The desired View
                    */
                    create: function(elements, view) {
                        var element = new Element(elements);

                        if (view instanceof View) {
                            view.addElement(element);
                        }

                        return element;
                    },

                    REVERSE_BINDING: Element.REVERSE_BINDING,
                    ONE_WAY_BINDING: Element.ONE_WAY_BINDING,
                    TWO_WAY_BINDING: Element.TWO_WAY_BINDING
                };
            })(),

            View: View
        };

        //Public instance variables
        return ViewModule;
    };

    return (function() {
        if (_singleton === null || typeof _singleton === "undefined") {
            _singleton = ViewModule;
        }

        return _singleton;
    })();
});

define('core/modules/core/core',['require','./core.controller','./core.event','./core.helper','./core.model','./core.module','./core.route','./core.view'],function(require) {
    

    var CoreController = require("./core.controller");
    var CoreEvent = require("./core.event");
    var CoreHelper = require("./core.helper");
    var CoreModel = require("./core.model");
    var CoreModule = require("./core.module");
    var CoreRoute = require("./core.route");
    var CoreView = require("./core.view");

    /*
        @abstract
        @class Core

        @classdesc Core class.
    */
    var Core = (function() {
        //Private instance members
        var Core = {};

        Core.Controller = new CoreController();
        Core.Event = new CoreEvent();
        Core.Helper = new CoreHelper();
        Core.Model = new CoreModel(Core);
        Core.Module = new CoreModule();
        Core.Route = new CoreRoute();
        Core.View = new CoreView();

        //Additional convenience bindings
        Core.go = Core.Route.go;

        //Public instance members
        return Core;
    })();

    return Core;
});

define('ampedjs',['require','./core/modules/core/core'],function(require) {
    

    var Core = require("./core/modules/core/core");

    return Core;
});
define('core/modules/ajax/models/xhr',['require','../../../../ampedjs','../../core/models/promise'],function(require) {
    

    var Am = require("../../../../ampedjs");
    var Promise = require("../../core/models/promise");

    /*
        @class Xhr

        @classdesc Xhr class.
    */

    /*
        @constructor Xhr

        Constructs a Xhr instance.

        @param {function} collectionGroup     The desired collection group.
    */
    var Xhr = Am.Model.create("Xhr",
        ["url", "method", "data", "status", "response"],
        {
            constructor: function(url, method) {
                this.set({
                    url: url,
                    method: method ? method : Xhr.METHOD_GET
                });
            }
        }
    );

    //Public static members
    Xhr.addStaticAttribute("METHOD_GET", "GET");
    Xhr.addStaticAttribute("METHOD_DELETE", "DELETE");
    Xhr.addStaticAttribute("METHOD_POST", "POST");
    Xhr.addStaticAttribute("METHOD_PUT", "PUT");

    //Private static members
    var serialize = function(object) {
        var pairs = [];

        for (var property in object) {
            if (!object.hasOwnProperty(property)) {
                continue;
            }
            if (Object.prototype.toString.call(object[property]) === "[object Object]") {
                pairs.push(serialize(object[property]));
                continue;
            }

            pairs.push(property + "=" + object[property]);
        }
        return pairs.join("&");
    };

    //Public prototype members
    /*
        @function send

        Sends the XMLHttpRequest.

        @return {Promise}
    */
    Xhr.addMethod("send", function() {
        var me = this;

        var promise = new Promise();

        if (!window.XMLHttpRequest) {
            promise.reject(new Error("Unable to create XMLHttpRequest."));
        }
        else {
            var xhr = new window.XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    me.set({
                        response: xhr.responseText,
                        status: xhr.status,
                    });

                    Am.Event.trigger(new Am.Event.Event(me, "success"));

                    promise.resolve(xhr.responseText);
                }
            };

            var data = me.get("data");
            var method = me.get("method");
            var url = me.get("url");

            if (data) {
                if (method === Xhr.METHOD_GET) {
                    url += "?" + serialize(data);
                }
                else {
                    data = serialize(data);
                }
            }
            else {
                data = undefined;
            }

            xhr.open(method, url);

            if (data && method !== Xhr.METHOD_GET) {
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }

            xhr.send(data);
        }

        return promise;
    });

    return Xhr;
});

define('core/modules/ajax/ajax',['require','../../../ampedjs','./models/xhr'],function(require) {
    

    var Am = require("../../../ampedjs");

    var Xhr = require("./models/xhr");

    /*
        @class Ajax

        @classdesc Ajax module.
    */

    return Am.Module.create("Ajax", {
        Xhr: Xhr
    });
});

define('core/modules/collections/models/collection',['require','../../../../ampedjs'],function(require) {
    

    var Am = require("../../../../ampedjs");

    /*
        @class Collection

        @classdesc Collection class.
    */

    /*
        @constructor Collection

        Constructs a Collection instance.

        @param {string} name        The desired name
        @param {Model} model        The desired model the collection will contain items of
    */
    var Collection = Am.Model.create("Collection",
        ["name", "model", "currentAutoIncrementNo", "items"],
        {
            constructor: function(name, model) {
                this.set({
                    name: name,
                    model: model,
                    currentAutoIncrementNo: 1,
                    items: [],
                    itemCount: 0
                 });
            }
        }
    );

    //Private static members
    var itemChangeListeners = [];

    /*
        @function triggerItemChange

        Triggers the item_change event on the collection

        @param {Collection} collection      The desired collection
        @param {Event} event                The desired event

    */
    var triggerItemChange = function(collection, event) {
        Am.Event.trigger(new Am.Event.Event(collection, "item_change", {
            item: event.getTarget(),
            changes: event.getData()
        }));
    };

    /*
        @function removeItem

        Removes the item with the specified identifier from the specified collection.

        @param {Collection} collection      The desired collection
        @param {int} id                     The desired item's identifier
    */
    var removeItem = function(collection, id) {
        var items = collection.getItems();
        var tmpItem = items[id];

        if (items[id]) {
            collection.set("itemCount", collection.get("itemCount") - 1);
        }
        delete items[id];

        var itemChangeListener;
        for (var i in itemChangeListeners) {
            itemChangeListener = itemChangeListeners[i];

            if (itemChangeListener.item.get("id") === id) {
                Am.Event.unobserve(tmpItem, "change", itemChangeListener.function);
                break;
            }
        }
        Am.Event.trigger(new Am.Event.Event(collection, "item_remove", { item: tmpItem }));
    };

    //Public prototype members
    /*
        @function hasItemWhere

        Checks if any item in the collection meets the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {Predicate[]} predicates        The desired predicates

        @return {boolean}
    */
    Collection.addMethod("hasItemWhere", function(predicates) {
        var items = this.get("items");
        var item, itemSatisfactory;

        for (var i in items) {
            item = items[i];
            itemSatisfactory = false;

            for (var j = 0, jLength = predicates.length; j < jLength; j++) {
                itemSatisfactory = predicates[j].test(item);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                return true;
            }
        }

        return false;
    });

    /*
        @function findItemWhere

        Gets the first item in the collection which meets the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {Predicate[]} predicates        The desired predicates

        @return {object|null}
    */
    Collection.addMethod("findItemWhere", function(predicates) {
        var items = this.get("items");
        var item, itemSatisfactory;

        for (var i in items) {
            item = items[i];
            itemSatisfactory = false;

            for (var j = 0, jLength = predicates.length; j < jLength; j++) {
                itemSatisfactory = predicates[j].test(item);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                return item;
            }
        }

        return null;
    });

    /*
        @function findItemsWhere

        Gets items in the collection which meet the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the property name) on each item in the collection.

        @param {Predicate[]} predicates        The desired predicates

        @return {object[]|null}
    */
    Collection.addMethod("findItemsWhere", function(predicates) {
        var items = this.get("items");
        var item, itemSatisfactory;

        var ret = [];

        for (var i in items) {
            item = items[i];
            itemSatisfactory = false;

            for (var j = 0, jLength = predicates.length; j < jLength; j++) {
                itemSatisfactory = predicates[j].test(item);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                ret.push(item);
            }
        }

        return (ret.length > 0 ? ret : null);
    });

    /*
        @function hasItemLike

        Checks if any item in the collection has the specified attribute and value. Note that attribute retrieval is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value

        @return {boolean}
    */
    Collection.addMethod("hasItemLike", function(attribute, value) {
        var items = this.get("items");

        for (var i in items) {
            if (items[i].get(attribute) === value) {
                return true;
            }
        }

        return false;
    });

    /*
        @function findItemLike

        Returns the first item in the collection which has a value matching the specified value for the specified
        attribute. Note that attribute retrieval is performed by calling getX() (where X is the property name) on each
        item in the collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value

        @return {object|null}
    */
    Collection.addMethod("findItemLike", function(attribute, value) {
        var items = this.get("items");

        for (var i in items) {
            if (items[i].get(attribute) === value) {
                return items[i];
            }
        }

        return null;
    });

    /*
        @function findItemsLike

        Returns items in the collection which have values matching the specified value for the specified attribute.
        Note that attribute retrieval is performed by calling getX() (where X is the property name) on each
        item in the collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value

        @return {object|null}
    */
    Collection.addMethod("findItemsLike", function(attribute, value) {
        var items = this.get("items");

        var ret = [];

        for (var i in items) {
            if (items[i].get(attribute) === value) {
                ret.push(items[i]);
            }
        }

        return (ret.length > 0 ? ret : null);
    });

    /*
        @function findItemsBetween

        Gets items in the collection which have values within (inclusive) the specified range for the specified
        attribute. Note that attribute retrieval is performed by calling getX() (where X is the attribute name) on
        each item in the collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value1           The first desired value
        @param {mixed} value2           The second desired value

        @return {object[]}
    */
    Collection.addMethod("findItemsBetween", function(attribute, value1, value2) {
        var items = this.get("items");

        var ret = [];

        for (var i in items) {
            var value = items[i].get(attribute);

            if (value >= value1 && value <= value2) {
                ret.push(items[i]);
            }
        }

        return ret;
    });

    /*
        @function removeItemLike

        Removes the first item in the collection which has a value matching the specified value for the specified
        attribute. Note that attribute retrieval is performed by calling getX() (where X is the attribute name) on each
        item in the collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value
    */
    Collection.addMethod("removeItemLike", function(attribute, value) {
        var items = this.get("items");

        for (var i in items) {
            if (items[i].get(attribute) === value) {
                removeItem(this, i);
                break;
            }
        }
    });

    /*
        @function removeItemsLike

        Removes items in the collection which have valuse matching the specified value for the specified attribute.
        Note that attribute reteieval is performed by calling getX() (where X is the attribute name) on each item in the
        collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value
    */
    Collection.addMethod("removeItemsLike", function(attribute, value) {
        var items = this.get("items");

        for (var i in items) {
            if (items[i].get(attribute) === value) {
                removeItem(this, i);
            }
        }
    });

    /*
        @function removeItemWhere

        Removes the first item in the collection which meets the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {Predicate[]} predicates        The desired predicates
    */
    Collection.addMethod("removeItemWhere", function(predicates) {
        var items = this.get("items");
        var item, itemSatisfactory;

        for (var i in items) {
            item = items[i];
            itemSatisfactory = false;

            for (var j = 0, jLength = predicates.length; j < jLength; j++) {
                itemSatisfactory = predicates[j].test(item);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                removeItem(this, i);
                break;
            }
        }
    });

    /*
        @function removeItemsWhere

        Removes items in the collection which meet the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {Predicate[]} predicates        The desired predicates
    */
    Collection.addMethod("removeItemsWhere", function(predicates) {
        var items = this.get("items");
        var item, itemSatisfactory;

        for (var i in items) {
            item = items[i];
            itemSatisfactory = false;

            for (var j = 0, jLength = predicates.length; j < jLength; j++) {
                itemSatisfactory = predicates[j].test(item);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                removeItem(this, i);
            }
        }
    });

    /*
        @function getNextAutoIncrementNo

        Returns the next auto increment number. Automatically updates session storage value for persistence.

        @return {int}
    */
    Collection.addMethod("getNextAutoIncrementNo", function() {
        var currentAutoIncrementNo = this.get("currentAutoIncrementNo");
        this.set("currentAutoIncrementNo", currentAutoIncrementNo + 1);

        return currentAutoIncrementNo;
    });

    /*
        @function resetAutoIncrementNo

        Resets the auto increment number. Automatically updates session storage value for persistence.
    */
    Collection.addMethod("resetAutoIncrementNo", function() {
        this.set("currentAutoIncrementNo", 1);
    });

    /*
        @function hasItem

        Checks if the specified item exists in the collection.

        @param {object} item        The desired item

        @return {boolean}
    */
    Collection.addMethod("hasItem", function(item) {
        return this.get("items").indexOf(item) !== -1;
    });

    /*
        @function findItem

        Returns the item with the specified identifier.

        @param {int} id     The desired identifier

        @return {object|null}
    */
    Collection.addMethod("findItem", function(id) {
        var items = this.get("items");

        return (items[id] || null);
    });

    /*
        @function findOrAddItem

        Finds the specified item to the collection or adds it if it does not already exist. Note that the setId() method
        will be called on the item if it is being added.

        @param {string} attribute       The desired attribute
        @param {object} item            The desired item

        @return {object}
    */
    Collection.addMethod("findOrAddItem", function(attribute, item) {
        var ret = null;

        //Attempt to return existing item first
        ret = this.findItemLike(attribute, item.get(attribute));

        if (!ret) {
            this.addItem(item);
            ret = item;
        }

        return ret;
    });

    /*
        @function removeItem

        Removes the specified item from the collection.

        @param {object|int} item        The desired item or its identifier
    */
    Collection.addMethod("removeItem", function(item) {
        var items = this.get("items");

        for (var i = 0, length = items.length; i < length; i++) {
            if (i === item || items[i] === item) {
                removeItem(this, i);
                break;
            }
        }
    });

    /*
        @function addItem

        Adds the specified item to the collection. Note that the setId() method will be called on the item unless it
        already has one (which is not null/undefined).

        @param {object} item    The desired item
    */
    Collection.addMethod("addItem", function(item) {
        var items = this.get("items");

        var id = item.getId();

        if (!id) {
            item.setId(this.getNextAutoIncrementNo());
            id = item.getId();
        }

        if (items[id] !== item) {
            if (!items[id]) {
                this.set("itemCount", this.get("itemCount") + 1);
            }

            items[id] = item;
            Am.Event.trigger(new Am.Event.Event(this, "item_add", { item: item }));
            var collection = this;
            var itemChangeListenerObject = {
                function: function(event) {
                    triggerItemChange(collection, event);
                },
                item: item
            };
            itemChangeListeners.push(itemChangeListenerObject);
            Am.Event.observe(item, "change", itemChangeListenerObject.function);
        }
    });

    return Collection;
});

define('core/modules/util/models/promise',['require','../../core/models/promise'],function(require) {
    

    var corePromise = require("../../core/models/promise");

    return corePromise;
});

define('core/modules/persistence/models/syncer',['require','../../../../ampedjs'],function(require) {
    

    var Am = require("../../../../ampedjs");

    /*
        @abstract
        @class Syncer

        @classdesc Syncer class.
    */

    /*
        @constructor Syncer

        Constructs a Syncer instance.
    */
    var Syncer = Am.Model.create("Syncer",
        ["data"],
        {
            constructor: function() {
                this.set({
                    map: {},
                    data: []
                 });
            }
        }
    );

    //Public static members
    Syncer.addStaticAttribute("ACTION_CREATE", "create");
    Syncer.addStaticAttribute("ACTION_DELETE", "delete");
    Syncer.addStaticAttribute("ACTION_READ", "read");
    Syncer.addStaticAttribute("ACTION_UPDATE", "update");
    Syncer.addStaticAttribute("ACTION_LIST", "list");

    Syncer.addStaticAttribute("STATUS_CREATED", "created");
    Syncer.addStaticAttribute("STATUS_DELETED", "deleted");
    Syncer.addStaticAttribute("STATUS_UNCHANGED", "unchanged");
    Syncer.addStaticAttribute("STATUS_UPDATED", "updated");

    //Private static members
    //(None)

    //Public prototype members
    /*
        @function map

        Maps the specified model and event to the specified endpoint.

        @param {function} model         The desired model
        @param {string} action          The desired action
        @param {string} endpoint        The desired endpoint
    */
    Syncer.addMethod("map", function(model, action, endpoint) {
        var map = this.get("map");
        var modelName = model.getModelName();

        if (!map[modelName]) {
            map[modelName] = {};
        }

        map[modelName][action] = endpoint;
    });

    /*
        @function getSyncStatus

        Gets the synchronization status of the specified item

        @param {object} item       The desired item
    */
    Syncer.addMethod("getSyncStatus", function(item) {
        var data = this.get("data");
        var dataItem;

        for (var i = 0, length = data.length; i < length; i++) {
            dataItem = data[i];

            if (dataItem.item === item) {
                return dataItem.status;
            }
        }

        return null;
    });

    /*
        @function setSyncStatus

        Sets the synchronization status of the specified item

        @param {object} item       The desired item
        @param {String} status     The desired sync status
    */
    Syncer.addMethod("setSyncStatus", function(item, status) {
        var data = this.get("data");
        var dataItem;

        for (var i = 0, length = data.length; i < length; i++) {
            dataItem = data[i];

            if (dataItem.item === item) {
                dataItem.status = status;
                return;
            }
        }

        data.push({
            item: item,
            status: status
        });
    });

    /*
        @function getSyncAction

        Gets the action that should be done to synchronize the specified item

        @param {object} item       The desired item
    */
    Syncer.addMethod("getSyncAction", function(item) {
        var syncStatus = this.getSyncStatus(item);

        var map = {};
        map[Syncer.STATUS_CREATED] = Syncer.ACTION_CREATE;
        map[Syncer.STATUS_DELETED] = Syncer.ACTION_DELETE;
        map[Syncer.STATUS_UNCHANGED] = null;
        map[Syncer.STATUS_UPDATED] = Syncer.ACTION_UPDATE;

        return map[syncStatus];
    });

    /*
        @function load
        @abstract

        Loads item(s) from the source to the collection group.

        @param {Model} model                The desired model
        @param {Predicate[]} predicates     The desired predicates

        @return {Promise}
    */
    //jshint unused:false
    Syncer.addMethod("load", function(model, predicates) {
    });
    //jshint unused:true

    /*
        @function save
        @abstract

        Saves the specified item to the source.

        @param {object} item        The desired item

        @return {Promise}
    */
    //jshint unused:false
    Syncer.addMethod("save", function(item) {
    });
    //jshint unused:true

    return Syncer;
});

define('core/modules/collections/models/collection-group',['require','../../../../ampedjs','../../util/models/promise','../../persistence/models/syncer'],function(require) {
    

    var Am = require("../../../../ampedjs");
    var Promise = require("../../util/models/promise");
    var Syncer = require("../../persistence/models/syncer");

    /*
        @class CollectionGroup

        @classdesc CollectionGroup class.
    */

    /*
        @constructor CollectionGroup

        Constructs a CollectionGroup instance.

        @param {string} name        The desired name
        @param [object}] syncer     The desired Syncer
    */
    var CollectionGroup = Am.Model.create("CollectionGroup",
        ["name", "syncer", "autoSave"],
        {
            constructor: function(name, syncer, options) {
                this.set({
                    name: name,
                    syncer: syncer ? syncer : null,
                    collections: {},
                    autoSave: options && options.autoSave === false ? false : true
                });

                var me = this;

                this.observe("item_add", function(event) {
                    var syncer = me.get("syncer");
                    var item = event.getData().item;

                    if (syncer) {
                        syncer.setSyncStatus(item, Syncer.STATUS_CREATED);
                        if (me.get("autoSave")) {
                            syncer.save(item);
                        }
                    }
                });

                this.observe("item_change", function(event) {
                    var syncer = me.get("syncer");
                    var item = event.getData().item;

                    if (syncer) {
                        if (syncer.getSyncStatus(item) !== Syncer.STATUS_CREATED) {
                            syncer.setSyncStatus(item, Syncer.STATUS_UPDATED);
                            if (me.get("autoSave")) {
                                syncer.save(item);
                            }
                        }
                    }
                });

                this.observe("item_remove", function(event) {
                    var syncer = me.get("syncer");
                    var item = event.getData().item;

                    if (syncer) {
                        if (syncer.getSyncStatus(item) !== Syncer.STATUS_CREATED) {
                            syncer.setSyncStatus(item, Syncer.STATUS_DELETED);
                            if (me.get("autoSave")) {
                                syncer.save(item);
                            }
                        }
                    }
                });
            }
        }
    );

    //Private static members
    var itemAddListeners = [];
    var itemChangeListeners = [];
    var itemRemoveListeners = [];

    /*
        @function triggerItemAdd

        Triggers the item_add event on the collection group.

        @param {CollectionGroup} collectionGroup        The desired collection group
        @param {Event} event                            The desired event

    */
    var triggerItemAdd = function(collectionGroup, event) {
        Am.Event.trigger(new Am.Event.Event(collectionGroup, "item_add", {
            collection: event.getTarget(),
            item: event.getData().item
        }));
    };

    /*
        @function triggerItemChange

        Triggers the item_change event on the collection group.

        @param {CollectionGroup} collectionGroup        The desired collection group
        @param {int} event                              The desired event

    */
    var triggerItemChange = function(collectionGroup, event) {
        Am.Event.trigger(new Am.Event.Event(collectionGroup, "item_change", {
            collection: event.getTarget(),
            item: event.getData().item,
            changes: event.getData().changes
        }));
    };

    /*
        @function triggerItemRemove

        Triggers the item_remove event on the collection group.

        @param {CollectionGroup} collectionGroup        The desired collection group
        @param {int} event                              The desired event

    */
    var triggerItemRemove = function(collectionGroup, event) {
        Am.Event.trigger(new Am.Event.Event(collectionGroup, "item_remove", {
            collection: event.getTarget(),
            item: event.getData().item
        }));
    };

    //Public prototype members
    /*
        @func getCollection

        Gets the specified Collection.

        @param {string} collection      The name of the desired collection

        @return {Collection}

    */
    CollectionGroup.addMethod("getCollection", function(collection) {
        return this.get("collections")[collection];
    });

    /*
        @func addCollection

        Adds the specified Collection to the CollectionGroup.

        @param {Collection} collection      The desired collection
    */
    CollectionGroup.addMethod("addCollection", function(collection) {
        var collections = this.get("collections");

        collections[collection.get("name")] = collection;

        var collectionGroup = this;
        var itemAddListener = {
            collection: collection,
            function: function(event) {
                triggerItemAdd(collectionGroup, event);
            }
        };
        var itemChangeListener = {
            collection: collection,
            function: function(event) {
                triggerItemChange(collectionGroup, event);
            }
        };
        var itemRemoveListener = {
            collection: collection,
            function: function(event) {
                triggerItemRemove(collectionGroup, event);
            }
        };

        itemAddListeners.push(itemAddListener);
        itemChangeListeners.push(itemChangeListener);
        itemRemoveListeners.push(itemRemoveListener);

        Am.Event.observe(collection, "item_add", itemAddListener.function);
        Am.Event.observe(collection, "item_change", itemChangeListener.function);
        Am.Event.observe(collection, "item_remove", itemRemoveListener.function);
        Am.Event.trigger(new Am.Event.Event(this, "collection_add", { collection: collection }));
    });

    /*
        @func removeCollection

        Removes the specified Collection from the CollectionGroup.

        @param {Collection|string} collection       The desired collection or its name
    */
    CollectionGroup.addMethod("removeCollection", function(collection) {
        var collections = this.get("collections");

        var targetCollectionName = typeof collection === "string" ? null : collection.get("name");

        var tmpCollection = collections[targetCollectionName];
        delete collections[targetCollectionName];

        var i, itemAddListener, itemChangeListener, itemRemoveListener;

        for (i in itemAddListeners) {
            itemAddListener = itemAddListeners[i];

            if (itemAddListener.collection === tmpCollection) {
                Am.Event.unobserve(tmpCollection, "item_add", itemAddListener.function);
                break;
            }
        }

        for (i in itemChangeListeners) {
            itemChangeListener = itemChangeListeners[i];

            if (itemChangeListener.collection === tmpCollection) {
                Am.Event.unobserve(tmpCollection, "item_change", itemChangeListener.function);
                break;
            }
        }

        for (i in itemRemoveListeners) {
            itemRemoveListener = itemRemoveListeners[i];

            if (itemRemoveListener.collection === tmpCollection) {
                Am.Event.unobserve(tmpCollection, "item_remove", itemRemoveListener.function);
                break;
            }
        }

        Am.Event.trigger(new Am.Event.Event(this, "collection_remove", { collection: tmpCollection }));
    });

    /*
        @func save

        Saves the specified Collection.

        @param {Collection|string} collection       The desired collection or its name

        @return {Promise}
    */
    CollectionGroup.addMethod("save", function(collection) {
        var promise = new Promise();

        var targetCollection = typeof collection === "string" ? this.get("collections")[collection] : collection;
        var syncer = this.get("syncer");
        var items = targetCollection.getItems();

        var item, syncStatus;
        var doneSaves = 0;
        var totalSaves = 0;
        var hasCompletedLoop = false;

        var tryResolvePromise = function() {
            doneSaves++;

            if (doneSaves === totalSaves && hasCompletedLoop) {
                promise.resolve(items);
            }
        };

        for (var i in items) {
            item = items[i];
            syncStatus = syncer.getSyncStatus(item);

            if (syncStatus !== null && syncStatus !== Syncer.STATUS_UNCHANGED) {
                totalSaves++;

                syncer.save(item).then(tryResolvePromise);
            }
        }

        hasCompletedLoop = true;

        return promise;
    });

    return CollectionGroup;
});

define('core/modules/collections/collections',['require','../../../ampedjs','./models/collection','./models/collection-group'],function(require) {
    

    var Am = require("../../../ampedjs");

    var Collection = require("./models/collection");
    var CollectionGroup = require("./models/collection-group");

    /*
        @class Collections

        @classdesc Collections module.
    */

    return Am.Module.create("Collections", {
        Collection: Collection,
        CollectionGroup: CollectionGroup
    });
});

define('core/modules/util/helpers/string-helper',['require','../../../../ampedjs','../../core/helpers/string-helper'],function(require) {
    

    var Am = require("../../../../ampedjs");
    var coreStringHelper = require("../../core/helpers/string-helper");

    var StringHelper = Am.Helper.create();

    /*
        @function convertToCamelCase

        Converts the specified snake-cased string to camel case.

        @param {string} string      The desired string

        @return {string}
    */
    StringHelper.addStaticMethod("convertToCamelCase", coreStringHelper.convertToCamelCase);

    /*
        @function convertToSnakeCase

        Converts the specified camel-cased string to snake case.

        @param {string} string      The desired string

        @return {string}
    */
    StringHelper.addStaticMethod("convertToSnakeCase", coreStringHelper.convertToSnakeCase);

    /*
        @function lowercaseFirst

        Converts the first character of the string to lower case.

        @param {string} string      The desired string

        @return {string}
    */
    StringHelper.addStaticMethod("lowercaseFirst", coreStringHelper.lowercaseFirst);

    /*
        @function uppercaseFirst

        Converts the first character of the string to upper case.

        @param {string} string      The desired string

        @return {string}
    */
    StringHelper.addStaticMethod("uppercaseFirst", coreStringHelper.uppercaseFirst);

    /*
        @function humanize

        Converts the string name to a "human format", replacing underscores/uppercase chars.

        @param {string} string      The desired string

        @return {string}
    */
    StringHelper.addStaticMethod("humanize", coreStringHelper.humanize);

    return StringHelper;
});

define('core/modules/persistence/models/rest-syncer',['require','../../../../ampedjs','../../util/helpers/string-helper','./syncer','../../core/models/promise','../../ajax/models/xhr'],function(require) {
    

    var Am = require("../../../../ampedjs");
    var StringHelper = require("../../util/helpers/string-helper");
    var Syncer = require("./syncer");
    var Promise = require("../../core/models/promise");
    var Xhr = require("../../ajax/models/xhr");

    /*
        @class RestSyncer

        @classdesc RestSyncer class.
    */

    /*
        @constructor RestSyncer

        Constructs a RestSyncer instance.

        @param {string} rootUrl       The desired REST API's root URL
    */
    var RestSyncer = Am.Model.create("RestSyncer",
        ["rootUrl"],
        {
            constructor: function(rootUrl) {
                this.set("rootUrl", rootUrl);
            },
            parent: Syncer
        }
    );

    //Private static members
    /*
        @function getEndpoint

        Gets the REST API endpoint for the specified model, action and identifier.

        @param {RestSyncer} restSyncer      The desired REST syncer
        @param {Model} model                The desired model
        @param {string} action              The desired action
        @param [{int}] id                   The item identifier

        @return {object}
    */
    var getEndpoint = function(restSyncer, model, action, id) {
        var ret = {
            url: "",
            method: ""
        };

        var map = restSyncer.get("map");
        var modelName = model.getModelName();
        var rootUrl = restSyncer.get("rootUrl");

        //Use specified mapping if it is available
        if (map[modelName] && map[modelName][action]) {
            ret.url = rootUrl + "/" + map[modelName][action].url;
            ret.method = map[modelName][action].method || "";
        }

        //Determine URL
        if (ret.url === "") {
            if (map[modelName] && map[modelName]["*"]) {
                ret.url = rootUrl + "/" + map[modelName]["*"].url;
            }
            else {
                ret.url = rootUrl + "/" + (StringHelper.convertToSnakeCase(modelName)).toLowerCase();
            }
        }

        if (action !== Syncer.ACTION_CREATE && action !== Syncer.ACTION_LIST) {
            ret.url += "/" + id;
        }

        //Determine method
        if (ret.method === "") {
            var methodMap = {};
            methodMap[Syncer.ACTION_CREATE] = Xhr.METHOD_POST;
            methodMap[Syncer.ACTION_DELETE] = Xhr.METHOD_DELETE;
            methodMap[Syncer.ACTION_READ] = Xhr.METHOD_GET;
            methodMap[Syncer.ACTION_UPDATE] = Xhr.METHOD_PUT;
            methodMap[Syncer.ACTION_LIST] = Xhr.METHOD_GET;

            ret.method = methodMap[action];
        }

        return ret;
    };

    //Public prototype members
    /*
        @function map

        Maps the specified model and event to the specified endpoint.

        @param {function} model             The desired model
        @param [{string}] action            The desired action
        @param {object|string} endpoint     The desired endpoint (object comprising url/method properties/ a URL string)
    */
    RestSyncer.addMethod("map", function(model, action, endpoint) {
        var map = this.get("map");
        var modelName = model.getModelName();

        if (!map[modelName]) {
            map[modelName] = {};
        }

        map[modelName][action] = {
            url: (typeof endpoint.url === "string" ? endpoint.url : (typeof endpoint === "string" ? endpoint : null)),
            method: (typeof endpoint.method === "string" ? endpoint.method : null)
        };
    });

    /*
        @function load

        Loads item(s) from the source to the collection group.

        @param {Model} model                    The desired model
        @param [{Predicate[]}] predicates       The desired predicates

        @return {Promise}
    */
    RestSyncer.addMethod("load", function(model, predicates) {
        var me = this;
        var promise = new Promise();
        var data = {};
        var predicate, operation;

        if (Array.isArray(predicates)) {
            for (var i = 0, length = predicates.length; i < length; i++) {
                predicate = predicates[i];
                operation = predicate.get("operation");
                data[StringHelper.convertToSnakeCase(predicate.get("attribute"))] =
                    (operation === "===" || operation === "==" ? "" : operation) + predicate.get("value");
            }
        }

        var xhr, endpoint;

        if (Array.isArray(predicates) && predicates.length === 1 && predicates[0].get("attribute") === "id" &&
            (predicates[0].get("operation") === "===" || predicates[0].get("operation") === "==")) {
            endpoint = getEndpoint(this, model, Syncer.ACTION_READ, predicates[0].get("value"));
            xhr = new Xhr(endpoint.url, endpoint.method);
        }
        else {
            endpoint = getEndpoint(this, model, Syncer.ACTION_LIST);

            xhr = new Xhr(endpoint.url, endpoint.method);

            if (predicates && predicates.length > 0) {
                xhr.setData(data);
            }
        }

        xhr.send().then(
            function(response) {
                var item;

                try {
                    if (xhr.getStatus() >= 400 && xhr.getStatus() <= 600) {
                        throw new Error("The response was a HTTP " + xhr.getStatus() + " error");
                    }

                    var itemsJson = JSON.parse(response);
                    var items = [];

                    if (Array.isArray(itemsJson)) {
                        for (var i in itemsJson) {
                            item = model.fromObject(itemsJson[i]);
                            items.push(item);
                            me.setSyncStatus(item, Syncer.STATUS_UNCHANGED);
                        }
                    }
                    else {
                        item = model.fromObject(itemsJson);
                        items.push(item);
                        me.setSyncStatus(item, Syncer.STATUS_UNCHANGED);
                    }
                    promise.resolve(items);
                }
                catch (e) {
                    promise.reject(new Error("The response could not be parsed as JSON."));
                }
            },
            function(error) {
                promise.reject(error);
            }
        );

        return promise;
    });

    /*
        @function save

        Saves the specified item to the source.

        @param {object} item    The desired item

        @return {Promise}
    */
    RestSyncer.addMethod("save", function(item) {
        var me = this;
        var promise = new Promise();

        var syncAction = this.getSyncAction(item);

        if (!syncAction) {
            promise.reject(new Error("Item is unchanged."));
        }

        var endpoint = getEndpoint(this, item.getModel(), syncAction, item.getId());

        var xhr = new Xhr(endpoint.url, endpoint.method);

        if (syncAction !== Syncer.ACTION_DELETE) {
            var data = item.toObject();
            delete data.id;

            xhr.setData(data);
        }

        xhr.send().then(
            function(response) {
                try {
                    if (syncAction !== Syncer.ACTION_DELETE) {
                        var responseObject = JSON.parse(response);
                        var changes = {};

                        //Compare the item and response for differences and update the former accordingly
                        var property, attribute;
                        for (property in responseObject) {
                            attribute = StringHelper.convertToCamelCase(property);

                            if (item.get(attribute) !== responseObject[property]) {
                                changes[attribute] = responseObject[property];
                            }
                        }

                        item.set(changes, { silent: true });
                    }

                    me.setSyncStatus(item, Syncer.STATUS_UNCHANGED);

                    promise.resolve(item);
                }
                catch (e) {
                    promise.reject(e);
                }
            },
            function(error) {
                promise.reject(error);
            }
        );


        return promise;
    });

    return RestSyncer;
});

define('core/modules/persistence/persistence',['require','../../../ampedjs','./models/syncer','./models/rest-syncer'],function(require) {
    

    var Am = require("../../../ampedjs");

    var Syncer = require("./models/syncer");
    var RestSyncer = require("./models/rest-syncer");

    /*
        @class Collections

        @classdesc Collections module.
    */

    return Am.Module.create("Persistence", {
        Syncer: Syncer,
        RestSyncer: RestSyncer
    });
});

define('core/modules/util/models/predicate',['require','../../../../ampedjs'],function(require) {
    

    var Am = require("../../../../ampedjs");

    /*
        @class Predicate

        @classdesc Predicate class.
    */

    /*
        @constructor Predicate

        Constructs a Predicate instance.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value
        @param {string} operation       The desired operation (===/==/</<=/>/>=/user-defined function)
    */
    var Predicate = Am.Model.create("Predicate",
        ["attribute", "value", "operation"],
        {
            constructor: function(attribute, value, operation) {
                this.set({
                    attribute: attribute,
                    value: value,
                    operation: operation ? operation : "==="
                 });
            }
        }
    );

    //Private static members
    //(None)

    //Public static members
    /*
        @function normalize

        Normalizes predicates from either of the following formats:

        {
            attribute: value
        }

        or

        [
            {
                attribute
                , value
                , operation = "===""
            }
        ]

        Accepted operation values are ==, ===, <, <=, >, >= and function references. If function references are being
        used, the referenced function should have the signature func(itemValue, predicateValue) and return a boolean.

        @return {Predicate[]}
    */
    Predicate.addStaticMethod("normalize", function(predicates) {
        var ret = [];
        var predicate;

        if (!Array.isArray(predicates)) {
            for (var attribute in predicates) {
                ret.push(new Predicate(attribute, predicates[attribute]));
            }
        }
        else {
            for (var i = 0, length = predicates.length; i < length; i++) {
                predicate = predicates[i];
                ret.push(new Predicate(predicate.attribute, predicate.value, predicate.operation));
            }
        }

        return ret;
    });

    //Public prototype members
        /*
        @function test

        Checks if the specified item satisfies the predicate.

        @param {object}     The desired item

        @return {boolean}
    */
    Predicate.addMethod("test", function(item) {
        var ret = false;

        var operation = this.get("operation");
        var itemValue = item.get(this.get("attribute"));
        var predicateValue = this.get("value");

        if (typeof operation === "function") {
            ret = operation(itemValue, predicateValue);
        }
        else {
            switch (operation) {
                case "===":
                    ret = itemValue === predicateValue;
                    break;
                case "==":
                    //jshint -W116
                    ret = itemValue == predicateValue;
                    //jshint +W116
                    break;
                case ">=":
                    ret = itemValue >= predicateValue;
                    break;
                case ">":
                    ret = itemValue > predicateValue;
                    break;
                case "<=":
                    ret = itemValue <= predicateValue;
                    break;
                case "<":
                    ret = itemValue < predicateValue;
                    break;
            }
        }

        return ret;
    });

    return Predicate;
});

define('core/modules/util/helpers/function-helper',['require','../../../../ampedjs','../../core/helpers/function-helper'],function(require) {
    

    var Am = require("../../../../ampedjs");
    var coreFunctionHelper = require("../../core/helpers/function-helper");

    var FunctionHelper = Am.Helper.create();

    /*
        @function override

        Creates a blank function.

        @return {function}
    */
    FunctionHelper.addStaticMethod("noop", coreFunctionHelper.noop);

    /*
        @function override

        Gets an overriden version of the specified function. The overriding function will be passed references to the
        original function, its scope and arguments so that the latter function can be called by running
        originalFunction.apply(scope, arguments);

        @param {function} originalFunction      The desired original function
        @param {function} overridingFunction    The desired overriding function

        @return {function}
    */
    FunctionHelper.addStaticMethod("override", coreFunctionHelper.override);

    return FunctionHelper;
});

define('core/modules/util/helpers/model-helper',['require','../../../../ampedjs','../../core/helpers/model-helper'],function(require) {
    

    var Am = require("../../../../ampedjs");
    var coreModelHelper = require("../../core/helpers/model-helper");

    var ModelHelper = Am.Helper.create();

    /*
        @function getGetter

        Gets the name of the getter method of the specified attribute.

        @param {string} attribute       The desired attribute

        @return {string}
    */
    ModelHelper.addStaticMethod("getGetter", coreModelHelper.getGetter);

    /*
        @function getSetter

        Gets the name of the setter method of the specified attribute.

        @param {string} attribute       The desired attribute

        @return {string}
    */
    ModelHelper.addStaticMethod("getSetter", coreModelHelper.getSetter);

    return ModelHelper;
});

define('core/modules/util/helpers/storage-helper',['require','../../../../ampedjs'],function(require) {
    

    var Am = require("../../../../ampedjs");

    var StorageHelper = Am.Helper.create();

    /*
        @function set

        Saves the specified key-value pair in the session storage.

        @param {string} key                 The desired key
        @param {(string|number)} value      The desired value
    */
    StorageHelper.addStaticMethod("set", function(key, value) {
        sessionStorage.setItem(key, value);
    });

    /*
        @function get

        Retrieves the value of the specified key from the session storage.

        @param {string} key     The desired key

        @return {mixed}
    */
    StorageHelper.addStaticMethod("get", function(key) {
        return sessionStorage.getItem(key);
    });

    /*
        @function reset

        Removes the specified key (and corresponding value) from the session storage.

        @param {string} key     The desired key
    */
    StorageHelper.addStaticMethod("reset", function(key) {
        sessionStorage.removeItem(key);
    });

    return StorageHelper;
});

define('core/modules/util/helpers/uuid-helper',['require','../../../../ampedjs','../../core/helpers/uuid-helper'],function(require) {
    

    var Am = require("../../../../ampedjs");
    var coreUuidHelper = require("../../core/helpers/uuid-helper");

    var UuidHelper = Am.Helper.create();

    /*
        @function generateUuid()

        Generates a UUID.

        @param {boolean = true} stripDashes     Flag indicating whether dashes should be stripped.

        @return {string}
    */
    UuidHelper.addStaticMethod("generateUuid", coreUuidHelper.generateUuid);

    return UuidHelper;
});

define('core/modules/util/util',['require','../../../ampedjs','./models/predicate','./models/promise','./helpers/function-helper','./helpers/model-helper','./helpers/storage-helper','./helpers/string-helper','./helpers/uuid-helper'],function(require) {
    

    var Am = require("../../../ampedjs");

    var Predicate = require("./models/predicate");
    var Promise = require("./models/promise");
    var FunctionHelper = require("./helpers/function-helper");
    var ModelHelper = require("./helpers/model-helper");
    var StorageHelper = require("./helpers/storage-helper");
    var StringHelper = require("./helpers/string-helper");
    var UuidHelper = require("./helpers/uuid-helper");

    /*
        @class Ajax

        @classdesc Ajax module.
    */

    return Am.Module.create("Util", {
        Predicate: Predicate,
        Promise: Promise,
        FunctionHelper: FunctionHelper,
        ModelHelper: ModelHelper,
        StorageHelper: StorageHelper,
        StringHelper: StringHelper,
        UuidHelper: UuidHelper
    });
});


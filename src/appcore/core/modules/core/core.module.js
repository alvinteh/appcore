define(function(require) {
    "use strict";

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

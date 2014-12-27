define(function(require){
    "use strict";

    var Promise = require("./models/promise");
    var StringHelper = require("./helpers/string-helper");

    var _singleton = null;

    var DIModule = function(CoreConfig, CoreRoute) {
        var RESOURCE_TYPES = {
            CONTROLLER:"controller",
            HELPER:"helper",
            MODEL: "model",
            VIEW: "view"
        };

        var DIModule = {
            /*
            @function getAppResourcePath

            Retrieves the specified .

            @param {string} resourceName        The desired resource's name
            @param {string} resourceType        The desired resource's type (controller/helper/model/view)
            @param []{string=app}] moduleName   The desired model's name

            @return {string}
            */
            getAppResourcePath: function(resourceName, resourceType, moduleName) {
                var appModuleResourceTypePath = CoreConfig.get("Am.App." + (moduleName ? moduleName + "." : "") +
                StringHelper.uppercaseFirst(resourceType) + "s.Path");

                if (!appModuleResourceTypePath) {
                    var appModulePath = CoreConfig.get("Am.App." + (moduleName ? moduleName + "." : "") + "Path");

                    if (!appModulePath) {
                        appModulePath = "app/" + (moduleName ? moduleName + "/" : "");
                    }

                    if (appModulePath.substring(appModulePath.length - 1) !== "/") {
                        appModulePath = appModulePath + "/";
                    }

                    appModuleResourceTypePath = appModulePath + resourceType + "s";
                }

                if (appModuleResourceTypePath.substring(appModuleResourceTypePath.length - 1) !== "/") {
                    appModuleResourceTypePath = appModuleResourceTypePath + "/";
                }

                return CoreRoute.getBaseUrl() +
                appModuleResourceTypePath + resourceName.toLowerCase() +
                (resourceType === RESOURCE_TYPES.MODEL || resourceType === RESOURCE_TYPES.VIEW ? "" :
                "-" + resourceType) + ".js";
            },

            /*
            @function getController

            Retrieves the specified controller.

            @param {string} name                The desired controller's name
            @param [{object}] options           Additional options for the method
            @param [{function}] options.module  The desired module to perform the load from

            @return {Promise}
            */
            getController: function(name, options) {
                var moduleName = options && options.module ?  options.module : null;

                return new Promise(function(resolve, reject) {
                    require([DIModule.getAppResourcePath(name, RESOURCE_TYPES.CONTROLLER, moduleName)],
                        function(controller) {
                            resolve(controller);
                        },
                        function(error) {
                            //The following code must be tested manually
                            //blanketjs:ignore true
                            reject(error);
                            //blanketjs:ignore false
                        }
                    );
                });
            },

            /*
                @function getHelper

                Retrieves the specified helper.

                @param {string} name                The desired helper's name
                @param [{object}] options           Additional options for the method
                @param [{function}] options.module  The desired module to perform the load from

                @return {Promise}
            */
            getHelper: function(name, options) {
                var moduleName = options && options.module ?  options.module : null;

                return new Promise(function(resolve, reject) {
                    require([DIModule.getAppResourcePath(name, RESOURCE_TYPES.HELPER, moduleName)],
                        function(helper) {
                            resolve(helper);
                        },
                        function(error) {
                            //The following code must be tested manually
                            //blanketjs:ignore true
                            reject(error);
                            //blanketjs:ignore false
                        }
                    );
                });
            },

            /*
                @function getModel

                Retrieves the specified model.

                @param {string} name                The desired model's name
                @param [{object}] options           Additional options for the method
                @param [{function}] options.module  The desired module to perform the load from

                @return {Promise}
            */
            getModel: function(name, options) {
                var moduleName = options && options.module ?  options.module : null;

                return new Promise(function(resolve, reject) {
                    require([DIModule.getAppResourcePath(name, RESOURCE_TYPES.MODEL, moduleName)],
                        function(model) {
                            resolve(model);
                        },
                        function(error) {
                            //The following code must be tested manually
                            //blanketjs:ignore true
                            reject(error);
                            //blanketjs:ignore false
                        }
                    );
                });
            },

            /*
                @function getView

                Retrieves the specified view.

                @param {string} name                The desired view's name
                @param [{object}] options           Additional options for the method
                @param [{function}] options.module  The desired module to perform the load from

                @return {Promise}
            */
            getView: function(name, options) {
                var moduleName = options && options.module ?  options.module : null;

                return new Promise(function(resolve, reject) {
                    require([DIModule.getAppResourcePath(name, RESOURCE_TYPES.VIEW, moduleName)],
                        function(view) {
                            resolve(view);
                        },
                        function(error) {
                            //The following code must be tested manually
                            //blanketjs:ignore true
                            reject(error);
                            //blanketjs:ignore false
                        }
                    );
                });
            }
        };

        return DIModule;
    };

    return (function() {
        if (_singleton === null || typeof _singleton === "undefined") {
            _singleton = DIModule;
        }

        return _singleton;
    })();
});

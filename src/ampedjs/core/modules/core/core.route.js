define(function(require) {
    "use strict";

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

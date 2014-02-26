define(function(require) {
    "use strict";

    var View = require("./models/view");

    var _singleton = null;

    var ViewModule = function(App, appData) {
        //Public instance members
        var ViewModule = {
            /*
                @function add

                Adds the specified view to the internal records.

                @param {object} view        The desired view
            */
            add: function(view) {
                //Ignore views which already exist in the internal records
                if (appData.views.indexOf(view) !== -1) {
                    return;
                }

                appData.views.push(view);
            },

            /*
                @function create

                Creates a View instance and adds it to the internal records.

                @param [htmlElement[]|htmlElement|string] elements      The desired HTML element(s)
            */
            create: function(elements) {
                var view = new View(elements);

                appData.views.push(view);

                return view;
            },

            /*
                @function refresh

                Refreshes all views which are data bound to the specified model instance. Generally speaking, this is
                automatically called by AppCore.

                @param [{object}] instance      The desired model instance.
            */
            refresh: function(instance) {
                for (var i = 0, length = appData.views.length; i < length; i++) {
                    var view = appData.views[i];

                    if ((instance === undefined && view.hasDataBindings()) || view.isDataBoundTo(instance)) {
                        view.refresh(instance);
                    }
                }
            }
        };

        return ViewModule;
    };

    return (function() {
        if (_singleton === null || _singleton === undefined) {
            _singleton = ViewModule;
        }

        return _singleton;
    })();
});
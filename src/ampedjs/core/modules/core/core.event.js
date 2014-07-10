define(function(require) {
    "use strict";

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

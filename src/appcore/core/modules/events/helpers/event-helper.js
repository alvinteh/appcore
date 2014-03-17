define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");
    var coreEventHelper = require("../../core/helpers/event-helper");

    var EventHelper = Ac.Helper.create("Event");

    /*
        @function observe

        Observes the specified target for the specified event such that the specified event listener is called when
        the aforementioned event fires.

        @param {object} target                  The desired object to be observed
        @param {string} event                   The desired event to be observed
        @param {function} eventListener         The desired event listener
    */
    EventHelper.addStaticMethod("observe", coreEventHelper.observe);

    /*
        @function unobserve

        Stops observing the specified target for the specified and specified event listener.

        @param {object} target                  The desired object to stop observing
        @param {string} event                   The desired event to stop observing
        @param {function} eventListener         The desired event listener
    */
    EventHelper.addStaticMethod("unobserve", coreEventHelper.unobserve);

    /*
        @function trigger

        Triggers the specified Event.

        @param {object} target      The desired Event
    */
    EventHelper.addStaticMethod("trigger", coreEventHelper.trigger);

    return EventHelper;
});
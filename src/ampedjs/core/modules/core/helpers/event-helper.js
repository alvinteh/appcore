define(function() {
    "use strict";

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

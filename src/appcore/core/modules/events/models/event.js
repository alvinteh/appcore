define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");

    /*
        @abstract
        @class Event

        @classdesc Event class.
    */

    /*
        @constructor Event

        Constructs a Event instance.

        @param {string} name        The desired name
        @param {object} target      The desired event target
        @param [{object}] data      The desired event data
    */
    var Event = Ac.Model.create(
        ["target", "name", "data"],
        function(target, name, data) {
            this.set({
                name: name,
                target: target,
                data: data ? data : {}
             });
        }
    );

    //Private static members
    //(None)

    //Public prototype members
    //(None)

    return Event;
});
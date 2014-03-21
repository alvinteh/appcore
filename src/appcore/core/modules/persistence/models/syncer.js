define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");
    var EventHelper = require("../../events/helpers/event-helper");
    var FunctionHelper = require("../../util/helpers/function-helper");

    /*
        @abstract
        @class Syncer

        @classdesc Syncer class.
    */

    /*
        @constructor Syncer

        Constructs a Syncer instance.

        @param {function} collectionGroup     The desired collection group.
    */
    var Syncer = Ac.Model.create(
        ["collectionGroup", "map", "listeners"],
        function(collectionGroup) {
            this.set({
                collectionGroup: collectionGroup,
                listeners: {
                    itemAdd: function() {},
                    itemChange: FunctionHelper.noop(),
                    itemRemove: FunctionHelper.noop(),
                    collectionAdd: FunctionHelper.noop(),
                    collectionRemove: FunctionHelper.noop()
                }
             });

            var listeners = this.get("listeners");

            EventHelper.observe(collectionGroup, "item_add", listeners.itemAdd);
            EventHelper.observe(collectionGroup, "item_change", listeners.itemChange);
            EventHelper.observe(collectionGroup, "item_remove", listeners.itemRemove);
            EventHelper.observe(collectionGroup, "collection_add", listeners.collectionAdd);
            EventHelper.observe(collectionGroup, "collection_remove", listeners.collectionRemove);
        }
    );

    //Private static members
    //(None)

    //Public prototype members
    /*
        @function map

        Maps the specified model (optionally filtered for the specified event) to the specified resource.

        @param {function} model         The desired model
        @param {string} resource        The desired resource
        @param [{string}] event         The desired event
    */
    Syncer.addMethod("map", function(model, resource, event) {
        var map = this.get("map");

        var mapModel = model === "*" ? "all" : model;
        var mapEvent = typeof event !== "string" || event === "*" ? "all" : event;

        map[mapModel][mapEvent] = resource;
    });

    /*
        @function pull

        Pulls item(s) from the source to the collection group.
    */
    //jshint unused:false
    Syncer.addMethod("pull", function(model, criteria) {
    });
    //jshint unused:true

    /*
        @function push

        Pushes the specified item( from the collection group to the source.
    */
    //jshint unused:false
    Syncer.addMethod("push", function(item) {
    });
    //jshint unused:true

    return Syncer;
});
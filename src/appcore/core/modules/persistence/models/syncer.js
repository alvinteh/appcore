define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");
    var EventHelper = require("../../core/helpers/event-helper");
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
    var Syncer = Ac.Model.create("Syncer",
        ["collectionGroup", "map", "listeners", "syncData"],
        function(collectionGroup) {
            this.set({
                collectionGroup: collectionGroup,
                listeners: {
                    itemAdd: FunctionHelper.noop(),
                    itemChange: FunctionHelper.noop(),
                    itemRemove: FunctionHelper.noop(),
                    collectionAdd: FunctionHelper.noop(),
                    collectionRemove: FunctionHelper.noop()
                },
                syncData: []
             });

            var listeners = this.get("listeners");

            EventHelper.observe(collectionGroup, "item_add", listeners.itemAdd);
            EventHelper.observe(collectionGroup, "item_change", listeners.itemChange);
            EventHelper.observe(collectionGroup, "item_remove", listeners.itemRemove);
            EventHelper.observe(collectionGroup, "collection_add", listeners.collectionAdd);
            EventHelper.observe(collectionGroup, "collection_remove", listeners.collectionRemove);
        }
    );

    //Public static members
    Syncer.addStaticAttribute("ACTION_CREATE", "create");
    Syncer.addStaticAttribute("ACTION_DELETE", "delete");
    Syncer.addStaticAttribute("ACTION_READ", "read");
    Syncer.addStaticAttribute("ACTION_UPDATE", "update");

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

        map[model][action] = endpoint;
    });

    /*
        @function getSyncStatus

        Gets the synchronization status of the specified item

        @param {object} item       The desired item
    */
    Syncer.addMethod("getSyncStatus", function(item) {
        var syncData = this.get("syncData");
        var syncDataItem;

        for (var i = 0, length = syncData.length; i < length; i++) {
            syncDataItem = syncData[i];

            if (syncDataItem.item === item) {
                return syncDataItem.status;
            }
        }

        return null;
    });

    /*
        @function getSyncAction

        Gets the action that should be done to synchronie the specified item

        @param {object} item       The desired item
    */
    Syncer.addMethod("getSyncAction", function(item) {
        var syncStatus = this.getSyncStatus(item);

        switch (syncStatus) {
            case Syncer.STATUS_CREATED:
                return Syncer.ACTION_CREATE;
            case Syncer.STATUS_DELETED:
                return Syncer.ACTION_DELETE;
            case Syncer.STATUS_UNCHANGED:
                return null;
            case Syncer.STATUS_UPDATED:
                return Syncer.ACTION_UPDATE;
        }
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

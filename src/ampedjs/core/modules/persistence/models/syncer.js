define(function(require) {
    "use strict";

    var Am = require("../../../../ampedjs");

    /*
        @abstract
        @class Syncer

        @classdesc Syncer class.
    */

    /*
        @constructor Syncer

        Constructs a Syncer instance.
    */
    var Syncer = Am.Model.create("Syncer",
        ["data"],
        {
            constructor: function() {
                this.set({
                    map: {},
                    data: []
                 });
            }
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
        var modelName = model.getModelName();

        if (!map[modelName]) {
            map[modelName] = {};
        }

        map[modelName][action] = endpoint;
    });

    /*
        @function getSyncStatus

        Gets the synchronization status of the specified item

        @param {object} item       The desired item
    */
    Syncer.addMethod("getSyncStatus", function(item) {
        var data = this.get("data");
        var dataItem;

        for (var i = 0, length = data.length; i < length; i++) {
            dataItem = data[i];

            if (dataItem.item === item) {
                return dataItem.status;
            }
        }

        return null;
    });

    /*
        @function setSyncStatus

        Sets the synchronization status of the specified item

        @param {object} item       The desired item
        @param {String} status     The desired sync status
    */
    Syncer.addMethod("setSyncStatus", function(item, status) {
        var data = this.get("data");
        var dataItem;

        for (var i = 0, length = data.length; i < length; i++) {
            dataItem = data[i];

            if (dataItem.item === item) {
                dataItem.status = status;
                return;
            }
        }

        data.push({
            item: item,
            status: status
        });
    });

    /*
        @function getSyncAction

        Gets the action that should be done to synchronize the specified item

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
        @function load
        @abstract

        Loads item(s) from the source to the collection group.

        @param {Model} model                The desired model
        @param {Predicate[]} predicates     The desired predicates

        @return {Promise}
    */
    //jshint unused:false
    Syncer.addMethod("load", function(model, predicates) {
    });
    //jshint unused:true

    /*
        @function save
        @abstract

        Saves the specified item to the source.

        @param {object} item        The desired item

        @return {Promise}
    */
    //jshint unused:false
    Syncer.addMethod("save", function(item) {
    });
    //jshint unused:true

    return Syncer;
});

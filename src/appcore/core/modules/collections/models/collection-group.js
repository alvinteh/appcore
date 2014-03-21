define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");
    var Event = require("../../events/models/event");
    var EventHelper = require("../../events/helpers/event-helper");

    /*
        @class CollectionGroup

        @classdesc CollectionGroup class.
    */

    /*
        @constructor CollectionGroup

        Constructs a CollectionGroup instance.

        @param {string} name        The desired name
        @param [object}] syncer     The desired Syncer
    */
    var CollectionGroup = Ac.Model.create(
        ["name", "syncer"],
        function(name, syncer) {
            this.set({
                name: name,
                syncer: syncer ? syncer : null,
                collections: {}
             });
        }
    );

    //Private static members
    /*
        @function triggerItemAdd

        Triggers the item_add event on the collection group.

        @param {int} event      The desired event

    */
    var triggerItemAdd = function(event) {
        EventHelper.trigger(new Event(this, "item_add", {
            collection: event.getTarget(),
            item: event.getData().item
        }));
    };

    /*
        @function triggerItemChange

        Triggers the item_change event on the collection group.

        @param {int} event      The desired event

    */
    var triggerItemChange = function(event) {
        EventHelper.trigger(new Event(this, "item_change", {
            collection: event.getTarget(),
            item: event.getData().item,
            changes: event.getData().changes
        }));
    };

    /*
        @function triggerItemRemove

        Triggers the item_remove event on the collection group.

        @param {int} event      The desired event

    */
    var triggerItemRemove = function(event) {
        EventHelper.trigger(new Event(this, "item_remove", {
            collection: event.getTarget(),
            item: event.getData().item
        }));
    };

    //Public prototype members
    /*
        @func addCollection

        Adds the specified Collection to the CollectionGroup.

        @param {object} collection      The desired collection
    */
    CollectionGroup.addMethod("addCollection", function(collection) {
        var collections = this.get("collections");

        collections[collection.get("name")] = collection;

        EventHelper.observe(collection, "item_add", triggerItemAdd);
        EventHelper.observe(collection, "item_change", triggerItemChange);
        EventHelper.observe(collection, "item_remove", triggerItemRemove);
        EventHelper.trigger(new Event(this, "collection_add", { collection: collection }));
    });

    /*
        @func removeCollection

        Removes the specified Collection from the CollectionGroup.

        @param {object|string} collection      The desired collection or its identifier
    */
    CollectionGroup.addMethod("removeCollection", function(collection) {
        var collections = this.get("collections");

        var targetCollectionName = typeof collection === "string" ? collection.get("name") : null;

        if (!targetCollectionName) {
            for (var collectionName in collections) {
                if (collectionName === collection) {
                    targetCollectionName = collectionName;
                }
            }
        }

        var tmpCollection = collections[targetCollectionName];
        delete collections[targetCollectionName];

        EventHelper.unobserve(tmpCollection, "item_add", triggerItemAdd);
        EventHelper.unobserve(tmpCollection, "item_change", triggerItemChange);
        EventHelper.unobserve(tmpCollection, "item_remove", triggerItemRemove);
        EventHelper.trigger(new Event(this, "collection_remove", { collection: tmpCollection }));
    });

    /*
        @func removeCollection

        Removes the specified Collection from the CollectionGroup.

        @param {object|string} collection      The desired collection or its identifier
    */
    CollectionGroup.addMethod("getCollectionItems", function(collection) {
        var collections = this.get("collections");

        var targetCollection = typeof collection === "string" ? null : collection.get("name");

        if (!targetCollection) {
            for (var collectionName in collections) {
                if (collectionName === collection) {
                    targetCollection = collections[collectionName];
                }
            }
        }

        return targetCollection.getItems();
    });

    return CollectionGroup;
});
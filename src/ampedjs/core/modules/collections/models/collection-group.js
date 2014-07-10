define(function(require) {
    "use strict";

    var Am = require("../../../../ampedjs");

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
    var CollectionGroup = Am.Model.create("CollectionGroup",
        ["name", "syncer"],
        {
            constructor: function(name, syncer) {
                this.set({
                    name: name,
                    syncer: syncer ? syncer : null,
                    collections: {}
                 });
            }
        }
    );

    //Private static members
    /*
        @function triggerItemAdd

        Triggers the item_add event on the collection group.

        @param {int} event      The desired event

    */
    var triggerItemAdd = function(event) {
        Am.Event.trigger(new Am.Event.Event(this, "item_add", {
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
        Am.Event.trigger(new Am.Event.Event(this, "item_change", {
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
        Am.Event.trigger(new Am.Event.Event(this, "item_remove", {
            collection: event.getTarget(),
            item: event.getData().item
        }));
    };

    //Public prototype members
    /*
        @func getCollection

        Gets the specified Collection.

        @param {string} collection      The name of the desired collection

        @return {Collection}

    */
    CollectionGroup.addMethod("getCollection", function(collection) {
        return this.get("collections")[collection];
    });

    /*
        @func addCollection

        Adds the specified Collection to the CollectionGroup.

        @param {object} collection      The desired collection
    */
    CollectionGroup.addMethod("addCollection", function(collection) {
        var collections = this.get("collections");

        collections[collection.get("name")] = collection;

        Am.Event.observe(collection, "item_add", triggerItemAdd);
        Am.Event.observe(collection, "item_change", triggerItemChange);
        Am.Event.observe(collection, "item_remove", triggerItemRemove);
        Am.Event.trigger(new Am.Event.Event(this, "collection_add", { collection: collection }));
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

        Am.Event.unobserve(tmpCollection, "item_add", triggerItemAdd);
        Am.Event.unobserve(tmpCollection, "item_change", triggerItemChange);
        Am.Event.unobserve(tmpCollection, "item_remove", triggerItemRemove);
        Am.Event.trigger(new Am.Event.Event(this, "collection_remove", { collection: tmpCollection }));
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

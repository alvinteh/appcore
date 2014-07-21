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
    var itemAddListeners = [];
    var itemChangeListeners = [];
    var itemRemoveListeners = [];

    /*
        @function triggerItemAdd

        Triggers the item_add event on the collection group.

        @param {CollectionGroup} collectionGroup        The desired collection group
        @param {Event} event                            The desired event

    */
    var triggerItemAdd = function(collectionGroup, event) {
        Am.Event.trigger(new Am.Event.Event(collectionGroup, "item_add", {
            collection: event.getTarget(),
            item: event.getData().item
        }));
    };

    /*
        @function triggerItemChange

        Triggers the item_change event on the collection group.

        @param {CollectionGroup} collectionGroup        The desired collection group
        @param {int} event                              The desired event

    */
    var triggerItemChange = function(collectionGroup, event) {
        Am.Event.trigger(new Am.Event.Event(collectionGroup, "item_change", {
            collection: event.getTarget(),
            item: event.getData().item,
            changes: event.getData().changes
        }));
    };

    /*
        @function triggerItemRemove

        Triggers the item_remove event on the collection group.

        @param {CollectionGroup} collectionGroup        The desired collection group
        @param {int} event                              The desired event

    */
    var triggerItemRemove = function(collectionGroup, event) {
        Am.Event.trigger(new Am.Event.Event(collectionGroup, "item_remove", {
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

        @param {Collection} collection      The desired collection
    */
    CollectionGroup.addMethod("addCollection", function(collection) {
        var collections = this.get("collections");

        collections[collection.get("name")] = collection;

        var collectionGroup = this;
        var itemAddListener = {
            collection: collection,
            function: function(event) {
                triggerItemAdd(collectionGroup, event);
            }
        };
        var itemChangeListener = {
            collection: collection,
            function: function(event) {
                triggerItemChange(collectionGroup, event);
            }
        };
        var itemRemoveListener = {
            collection: collection,
            function: function(event) {
                triggerItemRemove(collectionGroup, event);
            }
        };

        itemAddListeners.push(itemAddListener);
        itemChangeListeners.push(itemChangeListener);
        itemRemoveListeners.push(itemRemoveListener);

        Am.Event.observe(collection, "item_add", itemAddListener.function);
        Am.Event.observe(collection, "item_change", itemChangeListener.function);
        Am.Event.observe(collection, "item_remove", itemRemoveListener.function);
        Am.Event.trigger(new Am.Event.Event(this, "collection_add", { collection: collection }));
    });

    /*
        @func removeCollection

        Removes the specified Collection from the CollectionGroup.

        @param {Collection|string} collection       The desired collection or its name
    */
    CollectionGroup.addMethod("removeCollection", function(collection) {
        var collections = this.get("collections");

        var targetCollectionName = typeof collection === "string" ? null : collection.get("name");

        var tmpCollection = collections[targetCollectionName];
        delete collections[targetCollectionName];

        var i, itemAddListener, itemChangeListener, itemRemoveListener;

        for (i in itemAddListeners) {
            itemAddListener = itemAddListeners[i];

            if (itemAddListener.collection === tmpCollection) {
                Am.Event.unobserve(tmpCollection, "item_add", itemAddListener.function);
                break;
            }
        }

        for (i in itemChangeListeners) {
            itemChangeListener = itemChangeListeners[i];

            if (itemChangeListener.collection === tmpCollection) {
                Am.Event.unobserve(tmpCollection, "item_change", itemChangeListener.function);
                break;
            }
        }

        for (i in itemRemoveListeners) {
            itemRemoveListener = itemRemoveListeners[i];

            if (itemRemoveListener.collection === tmpCollection) {
                Am.Event.unobserve(tmpCollection, "item_remove", itemRemoveListener.function);
                break;
            }
        }

        Am.Event.trigger(new Am.Event.Event(this, "collection_remove", { collection: tmpCollection }));
    });

    return CollectionGroup;
});

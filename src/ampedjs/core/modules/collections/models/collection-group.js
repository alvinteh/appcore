define(function(require) {
    "use strict";

    var Am = require("../../../../ampedjs");
    var Promise = require("../../util/models/promise");
    var Syncer = require("../../persistence/models/syncer");

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
        ["name", "syncer", "autoSave"],
        {
            constructor: function(name, syncer, options) {
                this.set({
                    name: name,
                    syncer: syncer ? syncer : null,
                    collections: {},
                    autoSave: options && options.autoSave === false ? false : true
                });

                var me = this;

                this.observe("item_add", function(event) {
                    var syncer = me.get("syncer");
                    var item = event.getData().item;

                    if (syncer) {
                        syncer.setSyncStatus(item, Syncer.STATUS_CREATED);
                        if (me.get("autoSave")) {
                            syncer.save(item);
                        }
                    }
                });

                this.observe("item_change", function(event) {
                    var syncer = me.get("syncer");
                    var item = event.getData().item;

                    if (syncer) {
                        if (syncer.getSyncStatus(item) !== Syncer.STATUS_CREATED) {
                            syncer.setSyncStatus(item, Syncer.STATUS_UPDATED);
                            if (me.get("autoSave")) {
                                syncer.save(item);
                            }
                        }
                    }
                });

                this.observe("item_remove", function(event) {
                    var syncer = me.get("syncer");
                    var item = event.getData().item;

                    if (syncer) {
                        if (syncer.getSyncStatus(item) !== Syncer.STATUS_CREATED) {
                            syncer.setSyncStatus(item, Syncer.STATUS_DELETED);
                            if (me.get("autoSave")) {
                                syncer.save(item);
                            }
                        }
                    }
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

    /*
        @func save

        Saves the specified Collection.

        @param {Collection|string} collection       The desired collection or its name

        @return {Promise}
    */
    CollectionGroup.addMethod("save", function(collection) {
        var promise = new Promise();

        var targetCollection = typeof collection === "string" ? this.get("collections")[collection] : collection;
        var syncer = this.get("syncer");
        var items = targetCollection.getItems();

        var item, syncStatus;
        var doneSaves = 0;
        var totalSaves = 0;
        var hasCompletedLoop = false;

        var tryResolvePromise = function() {
            doneSaves++;

            if (doneSaves === totalSaves && hasCompletedLoop) {
                promise.resolve(items);
            }
        };

        for (var i in items) {
            item = items[i];
            syncStatus = syncer.getSyncStatus(item);

            if (syncStatus !== null && syncStatus !== Syncer.STATUS_UNCHANGED) {
                totalSaves++;

                syncer.save(item).then(tryResolvePromise);
            }
        }

        hasCompletedLoop = true;

        return promise;
    });

    return CollectionGroup;
});

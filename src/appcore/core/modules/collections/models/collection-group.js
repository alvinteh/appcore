define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");

    /*
        @abstract
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
    //(None)

    //Public prototype members
    /*
        @func addCollection

        Adds the specified Collection to the CollectionGroup.

        @param {object} collection      The desired collection
    */
    CollectionGroup.addMethod("addCollection", function(collection) {
        var collections = this.get("collections");

        collections[collection.get("name")] = collection;
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

        delete collections[targetCollectionName];
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
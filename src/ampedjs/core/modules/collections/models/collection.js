define(function(require) {
    "use strict";

    var Am = require("../../../../ampedjs");

    /*
        @class Collection

        @classdesc Collection class.
    */

    /*
        @constructor Collection

        Constructs a Collection instance.

        @param {string} name        The desired name
        @param {Model} model        The desired model the collection will contain items of
    */
    var Collection = Am.Model.create("Collection",
        ["name", "model", "currentAutoIncrementNo", "items"],
        {
            constructor: function(name, model) {
                this.set({
                    name: name,
                    model: model,
                    currentAutoIncrementNo: 1,
                    items: [],
                    itemCount: 0
                 });
            }
        }
    );

    //Private static members
    var itemChangeListeners = [];

    /*
        @function triggerItemChange

        Triggers the item_change event on the collection

        @param {Collection} collection      The desired collection
        @param {Event} event                The desired event

    */
    var triggerItemChange = function(collection, event) {
        Am.Event.trigger(new Am.Event.Event(collection, "item_change", {
            item: event.getTarget(),
            changes: event.getData()
        }));
    };

    /*
        @function removeItem

        Removes the item with the specified identifier from the specified collection.

        @param {Collection} collection      The desired collection
        @param {int} id                     The desired item's identifier
    */
    var removeItem = function(collection, id) {
        var items = collection.getItems();
        var tmpItem = items[id];

        if (items[id]) {
            collection.set("itemCount", collection.get("itemCount") - 1);
        }
        delete items[id];

        var itemChangeListener;
        for (var i in itemChangeListeners) {
            itemChangeListener = itemChangeListeners[i];

            if (itemChangeListener.item.get("id") === id) {
                Am.Event.unobserve(tmpItem, "change", itemChangeListener.function);
                break;
            }
        }
        Am.Event.trigger(new Am.Event.Event(collection, "item_remove", { item: tmpItem }));
    };

    //Public prototype members
    /*
        @function hasItemWhere

        Checks if any item in the collection meets the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {Predicate[]} predicates        The desired predicates

        @return {boolean}
    */
    Collection.addMethod("hasItemWhere", function(predicates) {
        var items = this.get("items");
        var item, itemSatisfactory;

        for (var i in items) {
            item = items[i];
            itemSatisfactory = false;

            for (var j = 0, jLength = predicates.length; j < jLength; j++) {
                itemSatisfactory = predicates[j].test(item);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                return true;
            }
        }

        return false;
    });

    /*
        @function findItemWhere

        Gets the first item in the collection which meets the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {Predicate[]} predicates        The desired predicates

        @return {object|null}
    */
    Collection.addMethod("findItemWhere", function(predicates) {
        var items = this.get("items");
        var item, itemSatisfactory;

        for (var i in items) {
            item = items[i];
            itemSatisfactory = false;

            for (var j = 0, jLength = predicates.length; j < jLength; j++) {
                itemSatisfactory = predicates[j].test(item);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                return item;
            }
        }

        return null;
    });

    /*
        @function findItemsWhere

        Gets items in the collection which meet the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the property name) on each item in the collection.

        @param {Predicate[]} predicates        The desired predicates

        @return {object[]|null}
    */
    Collection.addMethod("findItemsWhere", function(predicates) {
        var items = this.get("items");
        var item, itemSatisfactory;

        var ret = [];

        for (var i in items) {
            item = items[i];
            itemSatisfactory = false;

            for (var j = 0, jLength = predicates.length; j < jLength; j++) {
                itemSatisfactory = predicates[j].test(item);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                ret.push(item);
            }
        }

        return (ret.length > 0 ? ret : null);
    });

    /*
        @function hasItemLike

        Checks if any item in the collection has the specified attribute and value. Note that attribute retrieval is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value

        @return {boolean}
    */
    Collection.addMethod("hasItemLike", function(attribute, value) {
        var items = this.get("items");

        for (var i in items) {
            if (items[i].get(attribute) === value) {
                return true;
            }
        }

        return false;
    });

    /*
        @function findItemLike

        Returns the first item in the collection which has a value matching the specified value for the specified
        attribute. Note that attribute retrieval is performed by calling getX() (where X is the property name) on each
        item in the collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value

        @return {object|null}
    */
    Collection.addMethod("findItemLike", function(attribute, value) {
        var items = this.get("items");

        for (var i in items) {
            if (items[i].get(attribute) === value) {
                return items[i];
            }
        }

        return null;
    });

    /*
        @function findItemsLike

        Returns items in the collection which have values matching the specified value for the specified attribute.
        Note that attribute retrieval is performed by calling getX() (where X is the property name) on each
        item in the collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value

        @return {object|null}
    */
    Collection.addMethod("findItemsLike", function(attribute, value) {
        var items = this.get("items");

        var ret = [];

        for (var i in items) {
            if (items[i].get(attribute) === value) {
                ret.push(items[i]);
            }
        }

        return (ret.length > 0 ? ret : null);
    });

    /*
        @function findItemsBetween

        Gets items in the collection which have values within (inclusive) the specified range for the specified
        attribute. Note that attribute retrieval is performed by calling getX() (where X is the attribute name) on
        each item in the collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value1           The first desired value
        @param {mixed} value2           The second desired value

        @return {object[]}
    */
    Collection.addMethod("findItemsBetween", function(attribute, value1, value2) {
        var items = this.get("items");

        var ret = [];

        for (var i in items) {
            var value = items[i].get(attribute);

            if (value >= value1 && value <= value2) {
                ret.push(items[i]);
            }
        }

        return ret;
    });

    /*
        @function removeItemLike

        Removes the first item in the collection which has a value matching the specified value for the specified
        attribute. Note that attribute retrieval is performed by calling getX() (where X is the attribute name) on each
        item in the collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value
    */
    Collection.addMethod("removeItemLike", function(attribute, value) {
        var items = this.get("items");

        for (var i in items) {
            if (items[i].get(attribute) === value) {
                removeItem(this, i);
                break;
            }
        }
    });

    /*
        @function removeItemsLike

        Removes items in the collection which have valuse matching the specified value for the specified attribute.
        Note that attribute reteieval is performed by calling getX() (where X is the attribute name) on each item in the
        collection.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value
    */
    Collection.addMethod("removeItemsLike", function(attribute, value) {
        var items = this.get("items");

        for (var i in items) {
            if (items[i].get(attribute) === value) {
                removeItem(this, i);
            }
        }
    });

    /*
        @function removeItemWhere

        Removes the first item in the collection which meets the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {Predicate[]} predicates        The desired predicates
    */
    Collection.addMethod("removeItemWhere", function(predicates) {
        var items = this.get("items");
        var item, itemSatisfactory;

        for (var i in items) {
            item = items[i];
            itemSatisfactory = false;

            for (var j = 0, jLength = predicates.length; j < jLength; j++) {
                itemSatisfactory = predicates[j].test(item);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                removeItem(this, i);
                break;
            }
        }
    });

    /*
        @function removeItemsWhere

        Removes items in the collection which meet the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {Predicate[]} predicates        The desired predicates
    */
    Collection.addMethod("removeItemsWhere", function(predicates) {
        var items = this.get("items");
        var item, itemSatisfactory;

        for (var i in items) {
            item = items[i];
            itemSatisfactory = false;

            for (var j = 0, jLength = predicates.length; j < jLength; j++) {
                itemSatisfactory = predicates[j].test(item);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                removeItem(this, i);
            }
        }
    });

    /*
        @function getNextAutoIncrementNo

        Returns the next auto increment number. Automatically updates session storage value for persistence.

        @return {int}
    */
    Collection.addMethod("getNextAutoIncrementNo", function() {
        var currentAutoIncrementNo = this.get("currentAutoIncrementNo");
        this.set("currentAutoIncrementNo", currentAutoIncrementNo + 1);

        return currentAutoIncrementNo;
    });

    /*
        @function resetAutoIncrementNo

        Resets the auto increment number. Automatically updates session storage value for persistence.
    */
    Collection.addMethod("resetAutoIncrementNo", function() {
        this.set("currentAutoIncrementNo", 1);
    });

    /*
        @function hasItem

        Checks if the specified item exists in the collection.

        @param {object} item        The desired item

        @return {boolean}
    */
    Collection.addMethod("hasItem", function(item) {
        return this.get("items").indexOf(item) !== -1;
    });

    /*
        @function findItem

        Returns the item with the specified identifier.

        @param {int} id     The desired identifier

        @return {object|null}
    */
    Collection.addMethod("findItem", function(id) {
        var items = this.get("items");

        return (items[id] || null);
    });

    /*
        @function findOrAddItem

        Finds the specified item to the collection or adds it if it does not already exist. Note that the setId() method
        will be called on the item if it is being added.

        @param {string} attribute       The desired attribute
        @param {object} item            The desired item

        @return {object}
    */
    Collection.addMethod("findOrAddItem", function(attribute, item) {
        var ret = null;

        //Attempt to return existing item first
        ret = this.findItemLike(attribute, item.get(attribute));

        if (!ret) {
            this.addItem(item);
            ret = item;
        }

        return ret;
    });

    /*
        @function removeItem

        Removes the specified item from the collection.

        @param {object|int} item        The desired item or its identifier
    */
    Collection.addMethod("removeItem", function(item) {
        var items = this.get("items");

        for (var i = 0, length = items.length; i < length; i++) {
            if (i === item || items[i] === item) {
                removeItem(this, i);
                break;
            }
        }
    });

    /*
        @function addItem

        Adds the specified item to the collection. Note that the setId() method will be called on the item unless it
        already has one (which is not null/undefined).

        @param {object} item    The desired item
    */
    Collection.addMethod("addItem", function(item) {
        var items = this.get("items");

        var id = item.getId();

        if (!id) {
            item.setId(this.getNextAutoIncrementNo());
            id = item.getId();
        }

        if (items[id] !== item) {
            if (!items[id]) {
                this.set("itemCount", this.get("itemCount") + 1);
            }

            items[id] = item;
            Am.Event.trigger(new Am.Event.Event(this, "item_add", { item: item }));
            var collection = this;
            var itemChangeListenerObject = {
                function: function(event) {
                    triggerItemChange(collection, event);
                },
                item: item
            };
            itemChangeListeners.push(itemChangeListenerObject);
            Am.Event.observe(item, "change", itemChangeListenerObject.function);
        }
    });

    return Collection;
});

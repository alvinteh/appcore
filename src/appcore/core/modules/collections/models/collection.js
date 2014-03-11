define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");
    var ModelHelper = require("../../util/helpers/model-helper");

    /*
        @abstract
        @class Collection

        @classdesc Collection class.
    */

    /*
        @constructor Collection

        Constructs a Collection instance.

        @param {string} name        The desired name
        @param {function} model     The desired model the collection will contain items of
    */
    var Collection = Ac.Model.create(
        ["name", "model", "currentAutoIncrementNo", "items"],
        function(name, model) {
            this.set({
                name: name,
                model: model,
                currentAutoIncrementNo: 1,
                items: []
             });
        }
    );
    
    //Private static members
    /*
        @function normalizePredicates

        Normalizes predicates from the following format:

        {
            attribute: value
        }

        to the following format:

        [
            {
                attribute
                , value
                , operation = "===""
            }
        ]

        @return {object[]}
    */
    var normalizePredicates = function(predicates) {
        var ret = predicates;
        
        if (!predicates instanceof Array) {
            ret = [];

            for (var attribute in predicates) {
                ret.push({
                    attribute: attribute,
                    value: predicates[attribute],
                    operation: "==="
                });
            }
        }

        return ret;
    };

    /*
        @function satisfiesPredicate

        Checks if the specified item satisfied the specified predicate.

        @return {boolean}
    */
    var satisfiesPredicate = function(item, predicate) {
        var ret = false;

        var operation = predicate.operation ? predicate.operation : "===";
        var func = predicate.func ? predicate.func : null;
        var itemValue = item[ModelHelper.getGetter(predicate.attribute)]();
        var predicateValue = predicate.value;

        if (typeof func === "function") {
            itemValue = func(itemValue);
        }

        switch (operation) {
            case "===":
                ret = itemValue === predicateValue;
                break;
            case "==":
                //jshint -W116
                ret = itemValue == predicateValue;
                //jshint +W116
                break;
            case ">=":
                ret = itemValue >= predicateValue;
                break;
            case ">":
                ret = itemValue > predicateValue;
                break;
            case "<=":
                ret = itemValue <= predicateValue;
                break;
            case "<":
                ret = itemValue < predicateValue;
                break;
        }

        return ret;
    };

    //Public prototype members
    /*
        @function hasItemWhere

        Checks if any item in the collection meets the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {object[]} predicates        The desired predicates

        @return {boolean}
    */
    Collection.addMethod("hasItemWhere", function(predicates) {
        var items = this.get("items");

        for (var i = 0, iLength = items.length; i < iLength; i++) {
            var item = items[i];
            var itemSatisfactory = false;
            var normalizedPredicates = normalizePredicates(predicates);

            for (var j = 0, jLength = normalizedPredicates.length; j < jLength; j++) {
                itemSatisfactory = satisfiesPredicate(item, normalizedPredicates[j]);

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

        @param {object[]} predicates        The desired predicates

        @return {object|null}
    */
    Collection.addMethod("findItemWhere", function(predicates) {
        var items = this.get("items");

        for (var i = 0, iLength = items.length; i < iLength; i++) {
            var item = items[i];
            var itemSatisfactory = false;
            var normalizedPredicates = normalizePredicates(predicates);

            for (var j = 0, jLength = normalizedPredicates.length; j < jLength; j++) {
                itemSatisfactory = satisfiesPredicate(item, normalizedPredicates[j]);

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

        @param {object[]} predicates        The desired predicates

        @return {object[]|null}
    */
    Collection.addMethod("findItemsWhere", function(predicates) {
        var items = this.get("items");

        var ret = [];

        for (var i = 0, iLength = items.length; i < iLength; i++) {
            var item = items[i];
            var itemSatisfactory = false;
            var normalizedPredicates = normalizePredicates(predicates);

            for (var j = 0, jLength = normalizedPredicates.length; j < jLength; j++) {
                itemSatisfactory = satisfiesPredicate(item, normalizedPredicates[j]);

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
        var methodName = ModelHelper.getGetter(attribute);

        for (var i = 0, length = items.length; i < length; i++) {
            if (items[i][methodName]() === value) {
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
        var methodName = ModelHelper.getGetter(attribute);

        for (var i = 0, length = items.length; i < length; i++) {
            if (items[i][methodName]() === value) {
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
        var methodName = ModelHelper.getGetter(attribute);

        var ret = [];

        for (var i = 0, length = items.length; i < length; i++) {
            if (items[i][methodName]() === value) {
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
        var methodName = ModelHelper.getGetter(attribute);

        var ret = [];

        for (var i = 0, length = items.length; i < length; i++) {
            var value = items[i][methodName]();

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
        var methodName = ModelHelper.getGetter(attribute);

        for (var i = 0, length = items.length; i < length; i++) {
            if (items[i][methodName]() === value) {
                delete items[i];
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
        var methodName = ModelHelper.getGetter(attribute);

        for (var i = 0, length = items.length; i < length; i++) {
            if (items[i][methodName]() === value) {
                delete items[i];
            }
        }
    });

    /*
        @function removeItemWhere

        Removes the first item in the collection which meets the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {object[]} predicates        The desired predicates
    */
    Collection.addMethod("removeItemWhere", function(predicates) {
        var items = this.get("items");

        for (var i = 0, iLength = items.length; i < iLength; i++) {
            var item = items[i];
            var itemSatisfactory = false;
            var normalizedPredicates = normalizePredicates(predicates);

            for (var j = 0, jLength = normalizedPredicates.length; j < jLength; j++) {
                itemSatisfactory = satisfiesPredicate(item, normalizedPredicates[j]);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                delete items[i];
                break;
            }
        }
    });

    /*
        @function removeItemsWhere

        Removes items in the collection which meet the specified predicates. Note that attribute retrival is
        performed by calling getX() (where X is the attribute name) on each item in the collection.

        @param {object[]} predicates        The desired predicates
    */
    Collection.addMethod("removeItemsWhere", function(predicates) {
        var items = this.get("items");

        for (var i = 0, iLength = items.length; i < iLength; i++) {
            var item = items[i];
            var itemSatisfactory = false;
            var normalizedPredicates = normalizePredicates(predicates);

            for (var j = 0, jLength = normalizedPredicates.length; j < jLength; j++) {
                itemSatisfactory = satisfiesPredicate(item, normalizedPredicates[j]);

                if (!itemSatisfactory) {
                    break;
                }
            }

            if (itemSatisfactory) {
                delete items[i];
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
        var methodName = ModelHelper.getGetter(attribute);
        ret = this.findItemLike(attribute, item[methodName]());

        if (!ret) {
            this.addItem(item);
            ret = item;
        }

        return ret;
    });

    /*
        @function removeItem

        Removes the specified item from the collection.

        @param {object} item        The desired item
    */
    Collection.addMethod("removeItem", function(item) {
        var items = this.get("items");

        for (var i = 0, length = items.length; i < length; i++) {
            if (items[i] === item) {
                delete items[i];
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

        items[id] = item;
    });

    return Collection;
});
define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");

    /*
        @class Predicate

        @classdesc Predicate class.
    */

    /*
        @constructor Predicate

        Constructs a Predicate instance.

        @param {string} attribute       The desired attribute
        @param {mixed} value            The desired value
        @param {string} operationg      The desired operation (===/==/</<=/>/>=/user-defined function)
    */
    var Predicate = Ac.Model.create("Predicate",
        ["attribute", "value", "operation"],
        function(attribute, value, operation) {
            this.set({
                attribute: attribute,
                value: value,
                operation: operation ? operation : "==="
             });
        }
    );

    //Private static members
    //(None)

    //Public static members
    /*
        @function normalize

        Normalizes predicates from either of the following formats:

        {
            attribute: value
        }

        or

        [
            {
                attribute
                , value
                , operation = "===""
            }
        ]

        @return {Predicate[]}
    */
    Predicate.addStaticMethod("normalize", function(predicates) {
        var ret = [];
        var predicate;

        if (!Array.isArray(predicates)) {
            for (var attribute in predicates) {
                ret.push(new Predicate(attribute, predicates[attribute]));
            }
        }
        else {
            for (var i = 0, length = predicates.length; i < length; i++) {
                predicate = predicates[i];
                ret.push(new Predicate(predicate.attribute, predicate.value, predicate.operation));
            }
        }

        return ret;
    });

    //Public prototype members
        /*
        @function test

        Checks if the specified item satisfies the predicate.

        @param {object}     The desired item

        @return {boolean}
    */
    Predicate.addMethod("test", function(item) {
        var ret = false;

        var operation = this.get("operation");
        var itemValue = item.get(this.get("attribute"));
        var predicateValue = this.get("value");

        if (typeof operation === "function") {
            itemValue = operation(itemValue);
        }
        else {
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
        }

        return ret;
    });

    return Predicate;
});

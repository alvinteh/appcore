define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");

    var StringHelper = Ac.Helper.create("String");

    /*
        @function convertToSnakeCase

        Converts the specified camel-cased string to snake case.

        @param {string} string      The desired string
    */
    StringHelper.addStaticMethod("convertToSnakeCase", function(string) {
        return string.replace(/([A-Z])/g, function($1) { return "_" + $1.toLowerCase(); });
    });

    return StringHelper;
});
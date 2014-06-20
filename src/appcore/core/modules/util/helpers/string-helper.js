define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");
    var coreStringHelper = require("../../core/helpers/string-helper");

    var StringHelper = Ac.Helper.create();

    /*
        @function convertToCamelCase

        Converts the specified snake-cased string to camel case.

        @param {string} string      The desired string

        @return {string}
    */
    StringHelper.addStaticMethod("convertToCamelCase", coreStringHelper.convertToCamelCase);

    /*
        @function convertToSnakeCase

        Converts the specified camel-cased string to snake case.

        @param {string} string      The desired string

        @return {string}
    */
    StringHelper.addStaticMethod("convertToSnakeCase", coreStringHelper.convertToSnakeCase);

    /*
        @function lowercaseFirst

        Converts the first character of the string to lower case.

        @param {string} string      The desired string

        @return {string}
    */
    StringHelper.addStaticMethod("lowercaseFirst", coreStringHelper.lowercaseFirst);

    /*
        @function uppercaseFirst

        Converts the first character of the string to upper case.

        @param {string} string      The desired string

        @return {string}
    */
    StringHelper.addStaticMethod("uppercaseFirst", coreStringHelper.uppercaseFirst);

    /*
        @function humanize

        Converts the string name to a "human format", replacing underscores/uppercase chars.

        @param {string} string      The desired string

        @return {string}
    */
    StringHelper.addStaticMethod("humanize", coreStringHelper.humanize);

    return StringHelper;
});

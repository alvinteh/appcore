define(function(require) {
    "use strict";

    var Am = require("../../../../ampedjs");
    var coreModelHelper = require("../../core/helpers/model-helper");

    var ModelHelper = Am.Helper.create();

    /*
        @function getGetter

        Gets the name of the getter method of the specified attribute.

        @param {string} attribute       The desired attribute

        @return {string}
    */
    ModelHelper.addStaticMethod("getGetter", coreModelHelper.getGetter);

    /*
        @function getSetter

        Gets the name of the setter method of the specified attribute.

        @param {string} attribute       The desired attribute

        @return {string}
    */
    ModelHelper.addStaticMethod("getSetter", coreModelHelper.getSetter);

    return ModelHelper;
});

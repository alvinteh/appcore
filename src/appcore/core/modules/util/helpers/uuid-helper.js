define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");
    var coreUuidHelper = require("../../core/helpers/uuid-helper");

    var UuidHelper = Ac.Helper.create("Uuid");

    /*
        @function generateUuid()

        Generates a UUID.

        @param {boolean = true} stripDashes     Flag indicating whether dashes should be stripped.

        @return {string}
    */
    UuidHelper.addStaticMethod("generateUuid", coreUuidHelper.generateUuid);

    return UuidHelper;
});
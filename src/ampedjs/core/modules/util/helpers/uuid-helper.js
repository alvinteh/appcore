define(function(require) {
    "use strict";

    var Am = require("../../../../ampedjs");
    var coreUuidHelper = require("../../core/helpers/uuid-helper");

    var UuidHelper = Am.Helper.create();

    /*
        @function generateUuid()

        Generates a UUID.

        @param {boolean = true} stripDashes     Flag indicating whether dashes should be stripped.

        @return {string}
    */
    UuidHelper.addStaticMethod("generateUuid", coreUuidHelper.generateUuid);

    return UuidHelper;
});

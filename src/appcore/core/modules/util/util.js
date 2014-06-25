define(function(require) {
    "use strict";

    var Ac = require("../../../appcore");

    var Predicate = require("./models/predicate");
    var Promise = require("./models/promise");
    var FunctionHelper = require("./helpers/function-helper");
    var ModelHelper = require("./helpers/model-helper");
    var StorageHelper = require("./helpers/storage-helper");
    var StringHelper = require("./helpers/string-helper");
    var UuidHelper = require("./helpers/uuid-helper");

    /*
        @class Ajax

        @classdesc Ajax module.
    */

    return Ac.Module.create("Util", {
        Predicate: Predicate,
        Promise: Promise,
        FunctionHelper: FunctionHelper,
        ModelHelper: ModelHelper,
        StorageHelper: StorageHelper,
        StringHelper: StringHelper,
        UuidHelper: UuidHelper
    });
});

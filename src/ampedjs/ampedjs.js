define(function(require, exports, module) {
    "use strict";

    var Core = require("./core/modules/core/core");

    return new Core(module.config() || {});
});

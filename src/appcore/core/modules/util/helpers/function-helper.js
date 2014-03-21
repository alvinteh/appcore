define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");
    var coreFunctionHelper = require("../../core/helpers/function-helper");

    var FunctionHelper = Ac.Helper.create("Function");

    /*
        @function override

        Creates a blank function.

        @return {function}
    */
    FunctionHelper.addStaticMethod("noop", coreFunctionHelper.noop);

    /*
        @function override

        Gets an overriden version of the specified function. The overriding function will be passed references to the
        original function, its scope and arguments so that the latter function can be called by running
        originalFunction.apply(scope, arguments);

        @param {function} originalFunction      The desired original function
        @param {function} overridingFunction    The desired overriding function

        @return {function}
    */
    FunctionHelper.addStaticMethod("override", coreFunctionHelper.override);

    return FunctionHelper;
});
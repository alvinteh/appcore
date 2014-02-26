define(function() {
    "use strict";

    return (function() {
        return {
            /*
                @function override

                Gets an overriden version of the specified function. The overriding function will be passed references
                to the original function, its scope and arguments so that the latter function can be called by running
                originalFunction.apply(scope, arguments);

                @param {function} originalFunction      The desired original function
                @param {function} overridingFunction    The desired overriding function

                @return {function}
            */
            override: function(originalFunction, overridingFunction) {
                return function() {
                    overridingFunction(originalFunction, this, arguments);
                };
            }
        };
    })();
});
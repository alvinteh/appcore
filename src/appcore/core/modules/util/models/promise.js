define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");

    /*
        @abstract
        @class Promise

        @classdesc Promise class.
    */

    var STATE = {
        UNFULFILLED: 0,
        FULFILLED: 1,
        REJECTED: 2
    };

    /*
        @constructor Promise

        Constructs a Promise instance.
    */
    var Promise = Ac.Model.create(
        ["state", "value", "queue"],
        function(func) {
            var me = this;

            me.set({
                state: STATE.UNFULFILLED,
                queue: []
             });

            if (func) {
                func(function(value) {
                    me.resolve(value);
                }, function(error) {
                    me.transition(STATE.REJECTED, error);
                });
            }
        }
    );

    /*
        @function run

        Processes the desired promise's queue.

        @param {object} promise     The desired promise
    */
    var run = function(promise) {
        if (promise.get("state") === STATE.UNFULFILLED) {
            return;
        }

        setTimeout(function() {
            var queue = promise.get("queue");

            while (queue.length > 0) {
                var object = queue.shift();
                var value;

                try {
                    //jshint -W083
                    value = (promise.get("state") === STATE.FULFILLED ?
                        (object.fulfill || function(x) { return x; }) : (object.reject || function(x) { throw x; }))(
                        promise.get("value"));
                    //jshint +W083
                }
                catch (e) {
                    object.promise.transition(STATE.REJECTED, e);
                    continue;
                }
                object.promise.resolve(value);
            }
        }, 0);
    };

    //Public prototype members
    /*
        @function transition

        Transitions the promise to the desired state.

        @param {int} state          The desired state
        @param {mixed} value        The desired value
    */
    Promise.addMethod("transition", function(state, value) {
        var currentState = this.get("state");

        if (currentState === state || currentState !== STATE.UNFULFILLED || value === undefined ||
            (state !== STATE.FULFILLED && state !== STATE.REJECTED)) {
            return false;
        }

        this.set({
            state: state,
            value: value
        });

        run(this);
    });

    /*
        @function then

        Returns a new Promise with the desired callbacks.

        @param {function} fulfillCallback       The desired fulfill callback
        @param [{function}] rejectCallback      The desired reject callback

        @return {object}
    */
    Promise.addMethod("then", function(fulfillCallback, rejectCallback) {
        var promise = new Promise();
        var queue = this.get("queue");

        queue.push({
            fulfill: typeof fulfillCallback === "function" && fulfillCallback,
            reject: typeof rejectCallback === "function" && rejectCallback,
            promise: promise
        });

        run(this);
        
        return promise;
    });

    /*
        @function resolve

        Resolves the promise with the desired value.

        @param {mixed} x        The desired value or promise
    */
    Promise.addMethod("resolve", function(x) {
        if (this === x) {
            this.transition(STATE.REJECTED, new Error("Illegal promise self-resolution."));
        }
        else if (x && x instanceof Promise) {
            if (x.get("state") === STATE.UNFULFILLED) {
                var me = this;
                x.then(function(value) {
                    me.resolve(value);
                }, function(error) {
                    me.transition(STATE.REJECTED, error);
                });
            }
            else {
                this.transition(x.get("state"), x.get("value"));
            }
        }
        else if ((typeof x === "object" || typeof x === "function") && x !== null) {
            var called = false;

            try {
                var then = x.then;

                if (typeof then === "function") {
                    then.call(x, function(y) {
                        if (!called) {
                            this.resolve(y);
                        }
                        called = true;
                    }, function(r) {
                        if (!called) {
                            this.transition(STATE.REJECTED, r);
                        }
                        called = true;
                    });
                }
                else {
                    this.transition(STATE.FULFILLED, x);
                }
            }
            catch (e) {
                if (!called) {
                    this.transition(STATE.REJECTED, e);
                }
            }
        }
        else {
            this.transition(STATE.FULFILLED, x);
        }
    });

    /*
        @function reject

        Rejects the promise with the desired error.

        @param {mixed} error    The desired error
    */
    Promise.addMethod("reject", function(error) {
        this.transition(STATE.REJECTED, error);
    });


    /*
        @function convert

        Convets the specified function (assuming its signature follows the format func(callback, error, value) to use
        promises).

        @param {mixed} func     The desired function
    */
    Promise.addStaticMethod("convert", function(func) {
        return function() {
            var context = this;
            var args = [].slice.call(arguments);
            
            return new Promise(function(fulfillCallback, rejectCallback) {
                func.apply(context, [fulfillCallback, rejectCallback].concat(args));
            });
        };
    });

    return Promise;
});
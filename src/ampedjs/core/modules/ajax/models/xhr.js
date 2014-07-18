define(function(require) {
    "use strict";

    var Am = require("../../../../ampedjs");
    var Promise = require("../../core/models/promise");

    /*
        @class Xhr

        @classdesc Xhr class.
    */

    /*
        @constructor Xhr

        Constructs a Xhr instance.

        @param {function} collectionGroup     The desired collection group.
    */
    var Xhr = Am.Model.create("Xhr",
        ["url", "method", "data", "status", "response"],
        {
            constructor: function(url, method) {
                this.set({
                    url: url,
                    method: method ? method : Xhr.METHOD_GET
                });
            }
        }
    );

    //Public static members
    Xhr.addStaticAttribute("METHOD_GET", "GET");
    Xhr.addStaticAttribute("METHOD_DELETE", "DELETE");
    Xhr.addStaticAttribute("METHOD_POST", "POST");
    Xhr.addStaticAttribute("METHOD_PUT", "PUT");

    //Private static members
    var serialize = function(object) {
        var pairs = [];

        for (var property in object) {
            if (!object.hasOwnProperty(property)) {
                continue;
            }
            if (Object.prototype.toString.call(object[property]) === "[object Object]") {
                pairs.push(serialize(object[property]));
                continue;
            }

            pairs.push(property + "=" + object[property]);
        }
        return pairs.join("&");
    };

    //Public prototype members
    /*
        @function send

        Sends the XMLHttpRequest.

        @return {Promise}
    */
    Xhr.addMethod("send", function() {
        var me = this;

        var promise = new Promise();
        var BrowserXhr;

        if (!window.XMLHttpRequest) {
            promise.reject(new Error("Unable to create XMLHttpRequest."));
        }
        else {
            var xhr = new window.XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    me.set({
                        response: xhr.responseText,
                        status: xhr.status,
                    });

                    Am.Event.trigger(new Am.Event.Event(me, "success"));

                    promise.resolve(xhr.responseText);
                }
            };

            var data = me.get("data");
            var method = me.get("method");
            var url = me.get("url");

            if (data) {
                if (method === Xhr.METHOD_GET) {
                    url += "?" + serialize(data);
                }
                else {
                    data = serialize(data);
                }
            }
            else {
                data = undefined;
            }

            xhr.open(method, url);

            if (data && method !== Xhr.METHOD_GET) {
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }

            xhr.send(data);
        }

        return promise;
    });

    return Xhr;
});

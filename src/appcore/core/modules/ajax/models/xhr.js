define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");
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
    var Xhr = Ac.Model.create("Xhr",
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
    var BrowserXhr = (function() {
        if (window.XMLHttpRequest) {
            return window.XMLHttpRequest;
        }
        else if (window.ActiveXObject) {
            return window.ActiveXObject("Microsoft.XMLHTTP");
        }

        return null;
    })();

    //Public prototype members
    /*
        @function send

        Sends the XMLHttpRequest.

        @return {Promise}
    */
    Xhr.addMethod("send", function() {
        var me = this;

        return new Promise(function(resolve, reject) {
            if (!BrowserXhr) {
                reject(new Error("Unable to create XMLHttpRequest."));
            }

            var xhr = new BrowserXhr();

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    me.set({
                        response: xhr.responseText,
                        status: xhr.status,
                    });

                    Ac.Event.trigger(this, "success", me);

                    resolve(xhr.responseText);
                }
                else {
                    me.set("status", xhr.status);

                    Ac.Event.trigger(this, "fail", me);

                    reject(new Error("Unable to process XMLHttpRequest."));
                }

            };

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

            var data = this.get("data");
            var method = this.get("method");
            var url = this.get("url");

            if (data) {
                if (method === Xhr.METHOD_GET) {
                    url += "?" + serialize(data);
                }
                else {
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    data = serialize(data);
                }
            }
            else {
                data = undefined;
            }

            xhr.open(method, url);
            xhr.send(data);
      });
    });

    return Xhr;
});

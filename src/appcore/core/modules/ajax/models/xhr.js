define(function(require) {
    "use strict";

    var Ac = require("../../../../appcore");
    var EventHelper = require("../../events/helpers/event-helper");
    var Promise = require("../../util/models/promise");

    /*
        @abstract
        @class Xhr

        @classdesc Xhr class.
    */

    /*
        @constructor Xhr

        Constructs a Xhr instance.

        @param {function} collectionGroup     The desired collection group.
    */
    var Xhr = Ac.Model.create("Xhr",
        ["url", "method", "status", "response"],
        function(url, method) {
            this.set({
                url: url,
                method: method ? method : Xhr.METHOD_GET
            });
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

                    EventHelper.trigger(this, "success", me);

                    resolve(xhr.responseText);
                }
                else {
                    me.set("status", xhr.status);

                    EventHelper.trigger(this, "fail", me);

                    reject(new Error("Unable to process XMLHttpRequest."));
                }
                
            };

            xhr.open(this.get("method"), this.get("url"));
            xhr.send();
      });
    });

    return Xhr;
});
define(function(require) {
    "use strict";

    var Am = require("../../../../ampedjs");
    var StringHelper = require("../../util/helpers/string-helper");
    var Syncer = require("./syncer");
    var Predicate = require("../../util/models/predicate");
    var Promise = require("../../core/models/promise");
    var Xhr = require("../../ajax/models/xhr");

    /*
        @class RestSyncer

        @classdesc RestSyncer class.
    */

    /*
        @constructor RestSyncer

        Constructs a RestSyncer instance.

        @param {string} rootUrl       The desired REST API's root URL
    */
    var RestSyncer = Am.Model.create("RestSyncer",
        ["rootUrl"],
        {
            constructor: function(rootUrl) {
                this.set("rootUrl", rootUrl);
            },
            parent: Syncer
        }
    );

    //Private static members
    /*
        @function getEndpoint

        Gets the REST API endpoint for the specified model, action and identifier.

        @param {function} model     The desired model
        @param {string} action      The desired action
        @param [{int}] id           The item identifier

        @return {object}
    */
    var getEndpoint = function(model, action, id) {
        var ret = {
            url: "",
            method: ""
        };

        var map = this.get("map");
        var rootUrl = this.get("rootUrl");

        //Use specified mapping if it is available
        if (map[model] && map[model][action]) {
            ret.url = rootUrl + "/" + map[model][action];
        }

        //Determine URL
        if (ret.url === "") {
            if (map[model] && map[model]["*"]) {
                ret.url = rootUrl + "/" + map[model]["*"] + "/" + action;
            }
            else {
                ret.url = rootUrl + "/" + model.getName() + "/" + action;
            }
        }

        if (id) {
            ret.url += "/" + id;
        }

        //Determine method
        if (ret.method === "") {
            switch (action) {
                case Syncer.ACTION_CREATE:
                    ret.method = RestSyncer.METHOD_POST;
                    break;
                case Syncer.ACTION_DELETE:
                    ret.method = RestSyncer.METHOD_DELETE;
                    break;
                case Syncer.ACTION_VIEW:
                    ret.method = RestSyncer.METHOD_GET;
                    break;
                case Syncer.ACTION_UPDATE:
                    ret.method = RestSyncer.METHOD_PUT;
                    break;
            }
        }

        return ret;
    };

    //Public prototype members
    /*
        @function map

        Maps the specified model and event to the specified endpoint.

        @param {function} model             The desired model
        @param [{string}] action            The desired action
        @param {object|string} endpoint     The desired endpoint
    */
    RestSyncer.addMethod("map", function(model, action, endpoint) {
        var map = this.get("map");

        map[model][action] = {
            url: (typeof endpoint.url === "string" ? endpoint.url : (typeof endpoint === "string" ? endpoint: null)),
            method: (typeof endpoint.method === "string" ? endpoint.method : null)
        };
    });

    /*
        @function pull

        Pulls item(s) from the source to the collection group.

        @param {string} collection          The desired collection name
        @param [{object[]}] predicates      The desired predicates

        @return {Promise}
    */
    RestSyncer.addMethod("pull", function(collection, predicates) {
        var me = this;

        //jshint unused:true
        return new Promise(function(resolve, reject) {
        //jshint unused:false
            var normalizedPredicates = Predicate.normalize(predicates);
            var queryString = "";
            var predicate, operation;

            for (var i = 0, length = normalizedPredicates.length; i < length; i++) {
                predicate = normalizedPredicates[i];
                operation = predicate.getOperation();
                queryString += encodeURIComponent(StringHelper.convertToSnakeCase(predicate.getAttribute()) + "=" +
                (operation === "===" || operation === "==" ? "" : operation) + predicate.getValue());
            }

            var endpoint = getEndpoint(collection.getModel(), Syncer.ACTION_VIEW);

            var xhr = new Xhr(endpoint.url, endpoint.method);

            return xhr.send().then(function(response) {
                return new Promise(function(resolve, reject) {
                    try {
                        var data = JSON.parse(response);
                    }
                    catch (e) {
                        reject(new Error("The response could not be parsed as JSON."));
                    }

                    var collection = me.getCollection(collection);

                    for (var i = 0, length = response.length; i < length; i++) {
                        collection.addItem(response[i]);
                    }
                });
            });
        });
    });

    /*
        @function push

        Pushes the specified item from the collection group to the source.

        @param {object} item    The desired item

        @return {Promise}
    */
    RestSyncer.addMethod("push", function(item) {
        return new Promise(function(resolve, reject) {
            var syncAction = this.getSyncAction(item);

            if (!syncAction) {
                reject(new Error("Item is unchanged."));
            }

            var endpoint = getEndpoint(item.getModel(), syncAction, item.getId());

            var xhr = new Xhr(endpoint.url, endpoint.method);
            resolve(xhr.send());
        });
    });

    return RestSyncer;
});

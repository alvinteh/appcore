define(function(require) {
    "use strict";

    var Am = require("../../../../ampedjs");
    var StringHelper = require("../../util/helpers/string-helper");
    var Syncer = require("./syncer");
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

        @param {RestSyncer} restSyncer      The desired REST syncer
        @param {Model} model                The desired model
        @param {string} action              The desired action
        @param [{int}] id                   The item identifier

        @return {object}
    */
    var getEndpoint = function(restSyncer, model, action, id) {
        var ret = {
            url: "",
            method: ""
        };

        var map = restSyncer.get("map");
        var modelName = model.getModelName();
        var rootUrl = restSyncer.get("rootUrl");

        //Use specified mapping if it is available
        if (map[modelName] && map[modelName][action]) {
            ret.url = rootUrl + "/" + map[modelName][action].url;
            ret.method = map[modelName][action].method || "";
        }

        //Determine URL
        if (ret.url === "") {
            if (map[modelName] && map[modelName]["*"]) {
                ret.url = rootUrl + "/" + map[modelName]["*"].url;
            }
            else {
                ret.url = rootUrl + "/" + (StringHelper.convertToSnakeCase(modelName)).toLowerCase();
            }
        }

        if (id) {
            ret.url += "/" + id;
        }

        //Determine method
        if (ret.method === "") {
            var methodMap = {};
            methodMap[Syncer.ACTION_CREATE] = RestSyncer.METHOD_POST;
            methodMap[Syncer.ACTION_DELETE] = RestSyncer.METHOD_DELETE;
            methodMap[Syncer.ACTION_READ] = RestSyncer.METHOD_GET;
            methodMap[Syncer.ACTION_VIEW] = RestSyncer.METHOD_PUT;

            ret.method = methodMap[action];
        }

        return ret;
    };

    //Public prototype members
    /*
        @function map

        Maps the specified model and event to the specified endpoint.

        @param {function} model             The desired model
        @param [{string}] action            The desired action
        @param {object|string} endpoint     The desired endpoint (object comprising url/method properties/ a URL string)
    */
    RestSyncer.addMethod("map", function(model, action, endpoint) {
        var map = this.get("map");
        var modelName = model.getModelName();

        if (!map[modelName]) {
            map[modelName] = {};
        }

        map[modelName][action] = {
            url: (typeof endpoint.url === "string" ? endpoint.url : (typeof endpoint === "string" ? endpoint : null)),
            method: (typeof endpoint.method === "string" ? endpoint.method : null)
        };
    });

    /*
        @function load

        Loads item(s) from the source to the collection group.

        @param {Model} model                    The desired model
        @param [{Predicate[]}] predicates       The desired predicates

        @return {Promise}
    */
    RestSyncer.addMethod("load", function(model, predicates) {
        var promise = new Promise();
        var data = {};
        var predicate, operation;

        if (Array.isArray(predicates)) {
            for (var i = 0, length = predicates.length; i < length; i++) {
                predicate = predicates[i];
                operation = predicate.get("operation");
                data[StringHelper.convertToSnakeCase(predicate.get("attribute"))] =
                    (operation === "===" || operation === "==" ? "" : operation) + predicate.get("value");
            }
        }

        var xhr, endpoint;

        if (Array.isArray(predicates) && predicates.length === 1 && predicates[0].get("attribute") === "id" &&
            (predicates[0].get("operation") === "===" || predicates[0].get("operation") === "==")) {
            endpoint = getEndpoint(this, model, Syncer.ACTION_READ, predicates[0].get("value"));
            xhr = new Xhr(endpoint.url, endpoint.method)
        }
        else {
            endpoint = getEndpoint(this, model, Syncer.ACTION_READ);
            xhr = new Xhr(endpoint.url, endpoint.method)

            if (predicates && predicates.length > 0) {
                xhr.setData(data);
            }
        }

        xhr.send().then(
            function(response) {
                try {
                    if (xhr.getStatus() >= 400 && xhr.getStatus() <= 600) {
                        throw new Error("The response was a HTTP " + xhr.getStatus() + " error");
                    }

                    var itemsJson = JSON.parse(response);
                    var items = [];

                    if (Array.isArray(itemsJson)) {
                        for (var i in itemsJson) {
                            items.push(model.fromObject(itemsJson[i]));
                        }
                    }
                    else {
                        items.push(model.fromObject(itemsJson));
                    }
                    promise.resolve(items);
                }
                catch (e) {
                    promise.reject(new Error("The response could not be parsed as JSON."));
                }
            },
            function(error) {
                promise.reject(error);
            }
        );

        return promise;
    });

    /*
        @function save

        Saves the specified item to the source.

        @param {object} item    The desired item

        @return {Promise}
    */
    RestSyncer.addMethod("save", function(item) {
        return new Promise(function(resolve, reject) {
            var syncAction = this.getSyncAction(item);

            if (!syncAction) {
                reject(new Error("Item is unchanged."));
            }

            var endpoint = getEndpoint(this, item.getModel(), syncAction, item.getId());

            var xhr = new Xhr(endpoint.url, endpoint.method);
            xhr.setData(item.toObject());
            resolve(xhr.send());
        });
    });

    return RestSyncer;
});

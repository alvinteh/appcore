//Setup RequireJS
require.config({
    baseUrl: "dependencies",
    urlArgs: (new Date()).getTime().toString().substring(8),
    paths: {
        chai: "chai/chai"
    },
    use: {
        mocha: {
            attach: "mocha"
        }
    }
});

//Setup JavaScript dependencies
require([
        "../../src/appcore/appcore",
        "chai",
        "sinon/lib/sinon",
        "sinon/lib/sinon/spy",
        "sinon/lib/sinon/call",
        "sinon/lib/sinon/behavior",
        "sinon/lib/sinon/stub",
        "sinon/lib/sinon/mock",
        "sinon/lib/sinon/collection",
        "sinon/lib/sinon/assert",
        "sinon/lib/sinon/sandbox",
        "sinon/lib/sinon/test",
        "sinon/lib/sinon/test_case",
        "sinon/lib/sinon/assert",
        "sinon/lib/sinon/match",
    ], function(Am, chai) {

    window.Am = Am;

    //Setup utility get URL parameter function
    window.getUrlParam = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    //Setup Mocha
    chai.should();
    window.expect = chai.expect;
    window.mocha.setup("bdd");

    //Run tests
    require(["specs.js"], function() {
        window.mocha.run();
    });
});

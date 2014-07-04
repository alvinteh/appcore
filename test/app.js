//Setup RequireJS
require.config({
    baseUrl: "dependencies",
    urlArgs: (new Date()).getTime().toString().substring(8),
    packages: [
        {
            name: "appcore",
            location: "../../src/appcore",
            main: "appcore"
        }
    ],
    paths: {
        chai: "chai/chai",
        jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min"
    },
    use: {
        mocha: {
            attach: "mocha"
        }
    }
});

//Setup JavaScript dependencies
require([
        "appcore/appcore",
        "chai",
        "chai-as-promised/lib/chai-as-promised",
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
    ], function(Am, chai, chaiAsPromised) {

    chai.use(chaiAsPromised);

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
    require(["jquery", "specs.js"], function($) {
        $(function() {
            window.mocha.run();
        });
    });
});

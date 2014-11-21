//Setup RequireJS
require.config({
    baseUrl: "dependencies",
    urlArgs: (new Date()).getTime().toString().substring(8),
    packages: [
        {
            name: "ampedjs",
            location: "ampedjs",
            main: "ampedjs"
        }
    ],
    paths: {
        chai: "chai/chai",
        jquery: "jquery/jquery",
        sinon: "sinonjs/sinon",
    },
    use: {
        mocha: {
            attach: "mocha"
        }
    }
});

var test = function() {
    require([
        "ampedjs/ampedjs",
        "chai",
        "chai-as-promised/lib/chai-as-promised",
        "sinon"
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

        //Setup Mocha and Sinon
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
};

//Setup JavaScript dependencies
if (!window.MutationObserver && !window.WebkitMutationObserver) {
    require(["mutationobserver-shim"], test);
}
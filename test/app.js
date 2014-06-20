//Setup RequireJS
require.config({
    baseUrl: "dependencies",
    urlArgs: (new Date()).getTime().toString().substring(8),
    paths: {
        chai: "chai/chai",
    },
    use: {
        mocha: {
            attach: "mocha"
        }
    }
});

//Setup JavaScript dependencies
require(["../../src/appcore/appcore", "chai"], function(Am, chai) {
    window.Am = Am;

    //Setup Mocha
    chai.should();
    window.expect = chai.expect;
    window.mocha.setup("bdd");

    //Run tests
    require(["specs.js"], function() {
        window.mocha.run();
    });
});

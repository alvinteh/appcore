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
        webcomponentsjs: "webcomponentsjs/webcomponents"
    },
    shim: {
        webcomponentsjs: {
            exports: "MutationObserver"
        }
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

//Polyfill Function.prototype.bind for PhantomJS
//(Credits: MDN)
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
            return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

//Polyfill MutationObserver for PhantomJS
if (!window.MutationObserver && !window.WebkitMutationObserver) {
    require(["webcomponentsjs"], test);
}
else {
    test();
}
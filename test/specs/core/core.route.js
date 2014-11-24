define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Route", function() {
            var view = Am.View.create("#test");
            var usersController = Am.Controller.create();

            usersController.addAction("view", function() {
                test = "users.view";
            },{ view: view });

            usersController.addAction("edit", function() {
                test = "users.edit";
            },{ view: view });

            usersController.addAction("test", function(param1, param2, param3) {
                test = {
                    param1: param1,
                    param2: param2,
                    param3: param3,
                };
            },{ view: view });

            var test = "";

            afterEach(function() {
                test = "";
                Am.Route.unbind("/", true);
                Am.go("/");
            });

            it("should be defined", function(done) {
                expect(Am.Route).to.exist;

                done();
            });

            it("should call the appropriate enter events on views", function(done) {
                Am.Route.bind("/view", usersController, "view");

                var eventTest = "";
                var view = usersController.getAction("view").view;

                view.observe("enter", function() {
                    eventTest = "enter";
                });

                Am.go("/view");

                window.setTimeout(function() {
                    expect(eventTest).to.equal("enter");

                    done();
                }, 100);
            });

            it("should call the appropriate leave events on views", function(done) {
                Am.Route.bind("/view", usersController, "view");

                var eventTest = "";
                var view = usersController.getAction("view").view;

                view.observe("leave", function() {
                    eventTest = "leave";
                });

                Am.go("/view");
                window.history.back();

                window.setTimeout(function() {
                    expect(eventTest).to.equal("leave");
                    expect(window.location.href).to.equal(Am.Route.getBaseUrl());

                    done();
                }, 100);
            });

            describe("isBound()", function() {
                it("should check whether the specified path is bound to any action", function(done) {
                    expect(Am.Route.isBound("/fakePath")).to.be.false;

                    Am.Route.bind("/view", usersController, "view");
                    expect(Am.Route.isBound("/view")).to.be.true;

                    done();
                });

                it("should return true if the specified path is bound (inferred)", function(done) {
                    Am.Route.bind("/users", usersController);
                    expect(Am.Route.isBound("/users/view")).to.be.true;

                    done();
                });
            });

            describe("getBaseUrl()", function() {
                it("should retrieve the base URL with an ending slash", function(done) {

                    var baseUrl = window.location.href;
                    
                    
                    //Remove any hashes first
                    if (baseUrl.substr(baseUrl.length - 1) === "#") {
                        baseUrl = baseUrl.substr(0, baseUrl.length - 1);
                    }

                    //Append a "/" if necessary
                    if (baseUrl.substr(baseUrl.length - 1) !== "/") {
                        baseUrl += "/";
                    }

                    expect(Am.Route.getBaseUrl()).to.equal(baseUrl);
                    
                    done();
                });
            });

            describe("setBaseUrl()", function() {
                var baseUrl;

                before(function() {
                    baseUrl = Am.Route.getBaseUrl();
                });

                it("should set the base URL", function(done) {
                    var tmpBaseUrl = baseUrl + "xxx";

                    Am.Route.setBaseUrl(tmpBaseUrl);

                    expect(Am.Route.getBaseUrl()).to.equal(tmpBaseUrl);

                    done();
                });

                after(function() {
                   Am.Route.setBaseUrl(baseUrl);
                });
            });

            describe("bind()", function() {
                it("should bind the specified path to the specified controller and action", function(done) {
                    Am.Route.bind("/view", usersController, "view");
                    Am.Route.bind("/edit", usersController, "edit");

                    Am.go("/view");

                    expect(test).to.equal("users.view");
                    expect(window.location.href).to.equal(Am.Route.getBaseUrl() + "view");

                    Am.go("/edit");

                    expect(test).to.equal("users.edit");
                    expect(window.location.href).to.equal(Am.Route.getBaseUrl() + "edit");

                    done();
                });

                it("should infer paths if no action is specified", function(done) {
                    Am.Route.bind("/users", usersController);

                    Am.go("/users/view");

                    expect(test).to.equal("users.view");
                    expect(window.location.href).to.equal(Am.Route.getBaseUrl() + "users/view");

                    Am.go("/users/edit");

                    expect(test).to.equal("users.edit");
                    expect(window.location.href).to.equal(Am.Route.getBaseUrl() + "users/edit");

                    done();
                });

                it("should override previously-defined routes unless the old/new routes are explicit/inferred " +
                   "respectively", function(done) {

                    Am.Route.bind("/view", usersController, "view");
                    Am.Route.bind("/view", usersController, "edit");

                    Am.go("/view");

                    expect(test).to.equal("users.edit");
                    expect(window.location.href).to.equal(Am.Route.getBaseUrl() + "view");

                    test = "";

                    Am.Route.bind("/users/view", usersController, "edit");
                    Am.Route.bind("/users", usersController);

                    Am.go("/users/view");

                    expect(test).to.equal("users.edit");
                    expect(window.location.href).to.equal(Am.Route.getBaseUrl() + "users/view");

                    done();
                });

                it("should correctly normalize paths that start without a \"/\"", function(done) {
                    Am.Route.bind("view", usersController, "view");

                    Am.go("/view");

                    expect(test).to.equal("users.view");
                    expect(window.location.href).to.equal(Am.Route.getBaseUrl() + "view");

                    done();
                });

                it("should correctly normalize paths that end with a \"/\"", function(done) {
                    Am.Route.bind("view/", usersController, "view");

                    Am.go("/view");

                    expect(test).to.equal("users.view");
                    expect(window.location.href).to.equal(Am.Route.getBaseUrl() + "view");

                    done();
                });

                it("should call the action with the respective arguments", function(done) {
                    Am.Route.bind("/test/:param1/:param2/:param3", usersController, "test");

                    Am.go("/test/value1/value2/value3");

                    expect(test.param1).to.equal("value1");
                    expect(test.param2).to.equal("value2");
                    expect(test.param3).to.equal("value3");
                    expect(window.location.href).to.equal(Am.Route.getBaseUrl() + "test/value1/value2/value3");

                    done();
                });

                it("should correctly route paths with arguments", function(done) {
                    Am.Route.bind("/test/:param1/test2/:param2/:param3", usersController, "test");

                    Am.go("/test/value1/test2/value2/value3");

                    expect(test.param1).to.equal("value1");
                    expect(test.param2).to.equal("value2");
                    expect(test.param3).to.equal("value3");
                    expect(window.location.href).to.equal(Am.Route.getBaseUrl() + "test/value1/test2/value2/value3");

                    done();
                });
            });

            describe("unbind()", function() {
                it("should unbind the specified path", function(done) {
                    Am.Route.bind("/view", usersController, "view");
                    Am.Route.unbind("/view");

                    Am.go("/view");

                    expect(test).to.equal("");

                    done();
                });

                it("should infer paths if no action is specified", function(done) {
                    Am.Route.bind("/users", usersController);
                    Am.Route.unbind("/users");

                    Am.go("/view");

                    expect(test).to.equal("");

                    done();
                });

                it("should correctly normalize paths that start without a \"/\"", function(done) {
                    Am.Route.bind("/view", usersController, "view");
                    Am.Route.unbind("view");

                    Am.go("/view");

                    expect(test).to.equal("");

                    done();
                });

                it("should correctly normalize paths that end with a \"/\"", function(done) {
                    Am.Route.bind("/view", usersController, "view");
                    Am.Route.unbind("view/");

                    Am.go("/view");

                    expect(test).to.equal("");

                    done();
                });
            });
        });
    });
});

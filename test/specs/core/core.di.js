define(function(require) {
    var Am = window.Am;

    describe("Am", function() {
        describe("DI", function() {
            it("should be defined", function(done) {
                expect(Am.DI).to.exist;

                done();
            });

            var mocks;
            var mock = function(name, definition) {
                var moduleId = Am.Config.getBaseUrl() + "app/" + name + ".js";

                mocks.push(moduleId);

                define(moduleId, [], definition);
            };

            beforeEach(function() {
                mocks = [];
            });

            afterEach(function() {
                Am.Config.unset("Am.App");

                while (mocks.length) {
                    window.require.undef(mocks.shift());
                }
            });

            describe("getAppResourcePath()", function() {
                it("should correctly deduce paths for controller resources with the defaults", function(done) {
                    expect(Am.DI.getAppResourcePath("Tests", "controller")).to.deep.equal(
                        Am.Config.getBaseUrl() + "app/controllers/tests-controller.js");

                    done();
                });

                it("should correctly deduce paths for helper resources with the defaults", function(done) {
                    expect(Am.DI.getAppResourcePath("Test", "helper")).to.deep.equal(
                        Am.Config.getBaseUrl() + "app/helpers/test-helper.js");

                    done();
                });


                it("should correctly deduce paths for model resources with the defaults", function(done) {
                    expect(Am.DI.getAppResourcePath("Test", "model")).to.deep.equal(
                        Am.Config.getBaseUrl() + "app/models/test.js");

                    done();
                });

                it("should correctly deduce paths for view resources with the defaults", function(done) {
                    expect(Am.DI.getAppResourcePath("Test", "view")).to.deep.equal(
                        Am.Config.getBaseUrl() + "app/views/test.js");

                    done();
                });

                it("should correctly deduce paths for resources with module names", function(done) {
                    expect(Am.DI.getAppResourcePath("Test", "model", "test")).to.deep.equal(
                        Am.Config.getBaseUrl() + "app/test/models/test.js");

                    done();
                });

                it("should correctly deduce paths for resources with configured module paths", function(done) {
                    Am.Config.set("Am.App.test.Path", "xyz/")

                    expect(Am.DI.getAppResourcePath("Test", "model", "test")).to.deep.equal(
                        Am.Config.getBaseUrl() + "xyz/models/test.js");

                    done();
                });

                it("should correctly deduce paths for resources with configured resource type paths", function(done) {
                    Am.Config.set("Am.App.Models.Path", "m/")

                    expect(Am.DI.getAppResourcePath("Test", "model")).to.deep.equal(
                        Am.Config.getBaseUrl() + "m/test.js");

                    done();
                });

                it("should correctly deduce paths for resources with configured module resource type paths",
                    function(done) {
                    Am.Config.set("Am.App.test.Models.Path", "xyz/m/")

                    expect(Am.DI.getAppResourcePath("Test", "model", "test")).to.deep.equal(
                        Am.Config.getBaseUrl() + "xyz/m/test.js");

                    done();
                });

                it("should correctly deduce paths for resources with configured module paths not ending with slashes",
                    function(done) {
                    Am.Config.set("Am.App.test.Path", "xyz")

                    expect(Am.DI.getAppResourcePath("Test", "model", "test")).to.deep.equal(
                        Am.Config.getBaseUrl() + "xyz/models/test.js");

                    done();
                });

                it("should correctly deduce paths for resources with configured resource type paths not ending with " +
                    "slashes", function(done) {
                    Am.Config.set("Am.App.Models.Path", "m")

                    expect(Am.DI.getAppResourcePath("Test", "model")).to.deep.equal(
                        Am.Config.getBaseUrl() + "m/test.js");

                    done();
                });

                it("should correctly deduce paths for resources with configured module resource type paths not " +
                    "ending with slashes", function(done) {
                        Am.Config.set("Am.App.test.Models.Path", "xyz/m")

                        expect(Am.DI.getAppResourcePath("Test", "model", "test")).to.deep.equal(
                            Am.Config.getBaseUrl() + "xyz/m/test.js");

                        done();
                    });
            });

            describe("getController()", function() {
                it("should resolve the specified controller", function(done) {
                    mock("controllers/tests-controller", function(require) {
                        return Am.Controller.create([]);
                    });

                    Am.DI.getController("Tests").then(
                        function(controller) {
                            expect(controller).not.to.be.null;

                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });

                it("should resolve the specified controller and module", function(done) {
                    mock("test/controllers/tests-controller", function(require) {
                        return Am.Controller.create([]);
                    });

                    Am.DI.getController("Tests", { module: "test" }).then(
                        function(controller) {
                            expect(controller).not.to.be.null;
                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });
            });

            describe("getHelper()", function() {
                it("should resolve the specified helper", function(done) {
                    mock("helpers/test-helper", function(require) {
                        return Am.Helper.create();
                    });

                    Am.DI.getHelper("Test").then(
                        function(helper) {
                            expect(helper).not.to.be.null;

                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });

                it("should resolve the specified helper and module", function(done) {
                    mock("test/helpers/test-helper", function(require) {
                        return Am.Helper.create();
                    });

                    Am.DI.getHelper("Test", { module: "test" }).then(
                        function(helper) {
                            expect(helper).not.to.be.null;
                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });
            });

            describe("getModel()", function() {
                it("should resolve the specified model", function(done) {
                    mock("models/test", function(require) {
                        return Am.Model.create("Person", ["firstName", "lastName"]);
                    });

                    Am.DI.getModel("Test").then(
                        function(model) {
                            expect(model).not.to.be.null;

                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });

                it("should resolve the specified model and module", function(done) {
                    mock("test/models/test", function(require) {
                        return Am.Model.create("Person", ["firstName", "lastName"]);
                    });

                    Am.DI.getModel("Test", { module: "test" }).then(
                        function(model) {
                            expect(model).not.to.be.null;
                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });
            });

            describe("getView()", function() {
                it("should resolve the specified view", function(done) {
                    mock("views/test", function(require) {
                        return Am.View.create("#test1");
                    });

                    Am.DI.getView("Test").then(
                        function(view) {
                            expect(view).not.to.be.null;

                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });

                it("should resolve the specified view and module", function(done) {
                    mock("test/views/test", function(require) {
                        return Am.View.create("#test1");
                    });

                    Am.DI.getView("Test", { module: "test" }).then(
                        function(view) {
                            expect(view).not.to.be.null;
                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });
            });

        });
    });
});

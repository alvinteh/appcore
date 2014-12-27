define(["ampedjs/core/modules/core/models/controller"], function(Controller) {
    var Am = window.Am;

    describe("Am", function() {
        describe("Controller", function() {
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

            it("should be defined", function(done) {
                expect(Am.Controller).to.exist;

                done();
            });

            describe("create()", function() {
                it("should automatically add the created Controller to the internal records", function(done) {
                    $("#test").append("<div id=\"test1\">");
                    var controller = Am.Controller.create([]);

                    expect(Am.Controller.has(controller)).to.be.true;

                    done();
                });

                it("should correctly handle single model name arguments", function(done) {
                    mock("models/person", function(require) {
                        return Am.Model.create("Person", ["firstName", "lastName"]);
                    });

                    Am.Controller.create("Person").then(
                        function(controller) {
                            expect(Am.Controller.has(controller)).to.be.true;
                            expect(controller.getModel().getModelName()).to.deep.equal("Person");

                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });

                it("should correctly handle model name array arguments", function(done) {
                    mock("models/person", function(require) {
                        return Am.Model.create("Person", ["firstName", "lastName"]);
                    });

                    mock("models/job", function(require) {
                        return Am.Model.create("Job", ["title"]);
                    });

                    Am.Controller.create(["Person", "Job"]).then(
                        function(controller) {
                            expect(Am.Controller.has(controller)).to.be.true;
                            expect(controller.getModels()[0].getModelName()).to.deep.equal("Person");
                            expect(controller.getModels()[1].getModelName()).to.deep.equal("Job");

                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });
            });

            describe("add()", function() {
                it("should add the specified Controller to the internal records", function(done) {
                    var controller = new Controller([]);

                    Am.Controller.add(controller);

                    expect(Am.Controller.has(controller)).to.be.true;

                    done();
                });

                it("should ignore Controllers that already exist in the internal records", function(done) {
                    var controller = Am.Controller.create([]);

                    Am.Controller.add(controller);
                    Am.Controller.add(controller);

                    Am.Controller.remove(controller);

                    expect(Am.Controller.has(controller)).to.be.false;

                    done();
                });
            });

            describe("remove()", function() {
                it("should remove the specified Controller from the internal records", function(done) {
                    var controller = Am.Controller.create([]);

                    Am.Controller.remove(controller);

                    expect(Am.Controller.has(controller)).to.be.false;

                    done();
                });

                it("should not throw errors if the specified Controller does not exist in the internal records",
                    function(done) {
                    var controller = Am.Controller.create([]);

                    expect(function() { Am.Controller.remove(controller) }).to.not.throw();

                    done();
                });
            });

            describe("has()", function() {
                it("should check whether the specified Controller exists in the internal records", function(done) {
                    var controller = Am.Controller.create([]);

                    expect(Am.Controller.has(controller)).to.be.true;

                    Am.Controller.remove(controller);

                    expect(Am.Controller.has(controller)).to.be.false;

                    done();
                });
            });
        });
    });
});

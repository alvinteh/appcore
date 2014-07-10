define(["ampedjs/core/modules/core/models/controller"], function(Controller) {
    var Am = window.Am;

    describe("Am", function() {
        describe("Controller", function() {
            describe("Controller", function() {
                it("should be defined", function(done) {
                    expect(Am.Controller).to.exist;

                    done();
                });

                describe("Controller()", function() {
                    it("should accept calls with no arguments", function(done) {
                        var controller = new Controller();

                        var models = controller.getModels();

                        expect(models.length).to.equal(0);

                        done();
                    });

                    it("should accept calls with a single Model as an argument", function(done) {
                        var Person = Am.Model.create("Person", ["name"]);
                        var controller = new Controller(Person);

                        var models = controller.getModels();

                        expect(models.length).to.equal(1);
                        expect(models[0]).to.equal(Person);

                        done();
                    });

                    it("should accept calls with a single array of Model as an argument", function(done) {
                        var Person = Am.Model.create("Person", ["name"]);
                        var Pet = Am.Model.create("Pet", ["breed"]);
                        var controller = new Controller([Person, Pet]);

                        var models = controller.getModels();

                        expect(models.length).to.equal(2);
                        expect(models[0]).to.equal(Person);
                        expect(models[1]).to.equal(Pet);

                        done();
                    });
                });

                describe("getModels()", function() {
                    it("should return the controller's associated model(s)", function(done) {
                        var Person = Am.Model.create("Person", ["name"]);
                        var Pet = Am.Model.create("Pet", ["breed"]);
                        var controller = new Controller([Person, Pet]);

                        var models = controller.getModels();

                        expect(models.length).to.equal(2);
                        expect(models[0]).to.equal(Person);
                        expect(models[1]).to.equal(Pet);

                        done();
                    });
                });

                describe("getModel()", function() {
                    it("should return the main (first) model associated with the controller", function(done) {
                        var Person = Am.Model.create("Person", ["name"]);
                        var Pet = Am.Model.create("Pet", ["breed"]);
                        var controller = new Controller([Person, Pet]);

                        expect(controller.getModel()).to.equal(Person);

                        done();
                    });

                    it("should return null if there are no models associated with the controller", function(done) {
                        var controller = new Controller();

                        expect(controller.getModel()).to.be.null;

                        done();
                    });
                });

                describe("addAction()", function() {
                    it("should add an action to the controller", function(done) {
                        var controller = new Controller();
                        var func = function() {};
                        controller.addAction("action", func);

                        expect(controller.getAction("action").function).to.equal(func);
                        expect(controller.getAction("action").view).to.be.null;

                        done();
                    });

                    it("should respect the view option if it is present", function(done) {
                        var controller = new Controller();
                        var func = function() {};
                        var view = Am.View.create("#test");
                        controller.addAction("action", func, { view: view });

                        expect(controller.getAction("action").function).to.equal(func);
                        expect(controller.getAction("action").view).to.equal(view);

                        done();
                    });
                });

                describe("removeAction()", function() {
                    it("should remove the specified action", function(done) {
                        var controller = new Controller();
                        var func = function() {};
                        controller.addAction("action", func);
                        controller.removeAction("action");

                        expect(controller.getAction("action")).to.be.undefined;

                        done();
                    });
                });

                describe("getAction()", function() {
                    it("should return the specified action", function(done) {
                        var controller = new Controller();
                        var func = function() {};
                        controller.addAction("action", func);

                        expect(controller.getAction("action").function).to.equal(func);
                        expect(controller.getAction("action").view).to.be.null;

                        done();
                    });

                    it("should return undefined if the specified action does not exist", function(done) {
                        var controller = new Controller();

                        expect(controller.getAction("action")).to.be.undefined;

                        done();
                    });
                });

                describe("getActions()", function() {
                    it("should return all of the controller's action", function(done) {
                        var controller = new Controller();
                        var func1 = function() {};
                        var func2 = function() {};
                        controller.addAction("action1", func1);
                        controller.addAction("action2", func2);

                        var actions = controller.getActions();

                        expect(actions.length).to.equal(2);
                        expect(actions[0].function).to.equal(func1);
                        expect(actions[1].function).to.equal(func2);

                        done();
                    });
                });
            });
        });
    });
});

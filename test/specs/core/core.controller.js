define(["appcore/core/modules/core/models/controller"], function(Controller) {
    var Am = window.Am;

    describe("Am", function() {
        describe("Controller", function() {
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

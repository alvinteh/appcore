define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Helper", function() {
            it("should be defined", function(done) {
                expect(Am.Helper).to.exist;

                done();
            });

            describe("create()", function() {
                it("should create a blank Helper", function(done) {
                    var TestHelper = Am.Helper.create();

                    expect(TestHelper.addStaticMethod).to.exist;
                    expect(TestHelper.hasStaticMethod).to.exist;
                    expect(TestHelper.removeStaticMethod).to.exist;
                    expect(TestHelper.prototype.addStaticMethod).to.not.exist;
                    expect(TestHelper.prototype.hasStaticMethod).to.not.exist;
                    expect(TestHelper.prototype.removeStaticMethod).to.not.exist;

                    for (var property in TestHelper) {
                        if (TestHelper.hasOwnProperty(property) && property !== "prototype") {
                            if (property !== "addStaticMethod" && property !== "hasStaticMethod" && property !==
                                "removeStaticMethod") {
                                done("The property " + property + " should not exist.");
                            }
                        }
                    }

                    done();
                });
            });

            describe("addStaticMethod()", function() {
                it("should create a callable method", function(done) {
                    var TestHelper = Am.Helper.create();
                    TestHelper.addStaticMethod("test", function() {
                        return true;
                    });

                    expect(TestHelper.test()).to.be.true;

                    done();
                });

                it("should create a static method", function(done) {
                    var TestHelper = Am.Helper.create();
                    TestHelper.addStaticMethod("test", function() {
                        return true;
                    });

                    expect(TestHelper.test).to.exist;
                    expect(TestHelper.prototype.test).to.not.exist;

                    done();
                });

            });

            describe("hasStaticMethod()", function() {
                it("should detect whether the specified static method exists", function(done) {
                    var TestHelper = Am.Helper.create();
                    TestHelper.addStaticMethod("test", function() {
                        return true;
                    });

                    expect(TestHelper.hasStaticMethod("test")).to.be.true;
                    expect(TestHelper.hasStaticMethod("fakeMethod")).to.be.false;

                    done();
                });
            });

            describe("removeStaticMethod()", function() {
                it("should remove the specified static method from itself", function(done) {
                    var TestHelper = Am.Helper.create();
                    TestHelper.addStaticMethod("test", function() {
                        return true;
                    });

                    TestHelper.removeStaticMethod("test");

                    expect(TestHelper.test).to.not.exist;

                    done();
                });
            });

        });
    });
});

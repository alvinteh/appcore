define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Helper", function() {
            describe("instance.addStaticMethod()", function() {
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

            describe("instance.hasStaticMethod()", function() {
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

            describe("instance.removeStaticMethod()", function() {
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

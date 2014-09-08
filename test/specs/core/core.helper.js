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
        });
    });
});

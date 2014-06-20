define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Util", function() {
            describe("ModelHelper", function() {

                it("should be defined.", function(done) {
                    Am.Module.load("Util").then(function() {
                        var ModelHelper = Am.Module.get("Util").ModelHelper;

                        expect(ModelHelper).to.exist;

                        done();
                    });
                });

                describe("getGetter()", function() {
                    it("should retrieve the name of the getter method for a camel-cased attribute", function(done) {
                        Am.Module.load("Util").then(function() {
                            var ModelHelper = Am.Module.get("Util").ModelHelper;

                            var test1 = ModelHelper.getGetter("attribute") === "getAttribute";
                            var test2 = ModelHelper.getGetter("camelAttribute") === "getCamelAttribute";

                            expect(test1 && test2).to.be.true;

                            done();
                        });
                    });
                });

                describe("getSetter()", function() {
                    it("should retrieve the name of the setter method for a camel-cased attribute", function(done) {
                        Am.Module.load("Util").then(function() {
                            var ModelHelper = Am.Module.get("Util").ModelHelper;

                            var test1 = ModelHelper.getSetter("attribute") === "setAttribute";
                            var test2 = ModelHelper.getSetter("camelAttribute") === "setCamelAttribute";

                            expect(test1 && test2).to.be.true;

                            done();
                        });
                    });
                });
            });
        });
    });

});

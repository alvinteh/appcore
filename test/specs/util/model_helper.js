define(function() {
    var Am = window.Am;

    Am.Module.load("Util").then(function() {
        var ModelHelper = Am.Module.get("Util").ModelHelper;

        describe("Am", function() {
            describe("Util", function() {
                describe("ModelHelper", function() {

                    it("should be defined.", function(done) {
                        expect(ModelHelper).to.exist;

                        done();
                    });

                    describe("getGetter()", function() {
                        it("should retrieve the name of the getter method for a camel-cased attribute", function(done) {
                            expect(ModelHelper.getGetter("attribute")).to.equal("getAttribute");
                            expect(ModelHelper.getGetter("camelAttribute")).to.equal("getCamelAttribute");

                            done();
                        });
                    });

                    describe("getSetter()", function() {
                        it("should retrieve the name of the setter method for a camel-cased attribute", function(done) {
                            expect(ModelHelper.getSetter("attribute")).to.equal("setAttribute");
                            expect(ModelHelper.getSetter("camelAttribute")).to.equal("setCamelAttribute");

                            done();
                        });
                    });
                });
            });
        });
    });

});

define(function() {
    var Am = window.Am;

    Am.Module.load("Util").then(function() {
        var UuidHelper = Am.Module.get("Util").UuidHelper;

        describe("Am", function() {
            describe("Util", function() {
                describe("UuidHelper", function() {

                    it("should be defined.", function(done) {
                        expect(UuidHelper).to.exist;

                        done();
                    });

                    describe("generateUuid()", function() {
                        it("should generate a random string", function(done) {
                            expect(UuidHelper.generateUuid()).to.not.equal(UuidHelper.generateUuid());

                            done();
                        });

                        it("should keep dashes if specified", function(done) {
                            expect(UuidHelper.generateUuid().indexOf("-")).to.deep.equal(-1);
                            expect(UuidHelper.generateUuid(true).indexOf("-")).to.deep.equal(-1);
                            expect(UuidHelper.generateUuid(false).indexOf("-")).to.not.deep.equal(-1);

                            done();
                        });
                    });
                });
            });
        });
    });

});

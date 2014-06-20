define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Util", function() {
            describe("UuidHelper", function() {

                it("should be defined.", function(done) {
                    Am.Module.load("Util").then(function() {
                        var UuidHelper = Am.Module.get("Util").UuidHelper;

                        expect(UuidHelper).to.exist;

                        done();
                    });
                });

                describe("generateUuid()", function() {
                    it("should generate a random string", function(done) {
                        Am.Module.load("Util").then(function() {
                            var UuidHelper = Am.Module.get("Util").UuidHelper;

                            var uuid1 = UuidHelper.generateUuid();
                            var uuid2 = UuidHelper.generateUuid();

                            expect(uuid1).to.not.equal(uuid2);

                            done();
                        });
                    });

                    it("should keep dashes if specified",
                        function(done) {
                        Am.Module.load("Util").then(function() {
                            var UuidHelper = Am.Module.get("Util").UuidHelper;

                            var test1 = UuidHelper.generateUuid().indexOf("-") === -1;
                            var test2 = UuidHelper.generateUuid(true).indexOf("-") === -1;
                            var test3 = UuidHelper.generateUuid(false).indexOf("-") !== -1;

                            expect(test1 && test2 && test3).to.be.true;

                            done();
                        });
                    });
                });
            });
        });
    });

});

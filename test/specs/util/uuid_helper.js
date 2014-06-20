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

                            var uuid1 = UuidHelper.generateUuid().indexOf("-") === -1;
                            var uuid2 = UuidHelper.generateUuid(true).indexOf("-") === -1;
                            var uuid3 = UuidHelper.generateUuid(false).indexOf("-") !== -1;

                            expect(uuid1 && uuid2 && uuid3).to.be.true;

                            done();
                        });
                    });
                });
            });
        });
    });

});

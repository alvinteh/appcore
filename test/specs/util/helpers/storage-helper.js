define(function() {
    var Am = window.Am;

    Am.Module.load("Util").then(function() {
        var StorageHelper = Am.Module.get("Util").StorageHelper;

        describe("Am", function() {
            describe("Util", function() {
                describe("StorageHelper", function() {

                    it("should be defined.", function(done) {
                        expect(StorageHelper).to.exist;

                        done();
                    });

                    describe("set()", function() {
                        it("should save primitive values in session storage", function(done) {
                            StorageHelper.set("test", "value1");
                            expect(sessionStorage.getItem("test")).to.equal("value1");
                            sessionStorage.removeItem("test");

                            done();
                        });
                    });

                    describe("get()", function() {
                        it("should get primitive values from session storage", function(done) {
                            sessionStorage.setItem("test", "value2");
                            expect(StorageHelper.get("test")).to.equal("value2");
                            sessionStorage.removeItem("test");

                            done();
                        });
                    });

                    describe("reset()", function() {
                        it("should remove the specified item from session storage", function(done) {
                            sessionStorage.setItem("test", "value3");
                            StorageHelper.reset("test");
                            expect(sessionStorage.getItem("test")).to.not.exist;

                            done();
                        });
                    });
                });
            });
        });
    });

});

define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Module", function() {
            it("should be defined", function(done) {
                expect(Am.Module).to.exist;

                done();
            });

            describe("load()", function() {
                it("should resolve with the specified module if it can be loaded", function(done) {
                    Am.Module.load("Util").then(
                        function(result) {
                            expect(result).to.exist;
                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });

                it("should resolve with the specified modules if they can be loaded", function(done) {
                    Am.Module.load(["Ajax", "Util"]).then(
                        function(result) {
                            expect(result.Ajax).to.exist;
                            expect(result.Util).to.exist;
                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });
            });

            describe("get()", function() {
                it("should return the specified module if it has been loaded", function(done) {
                    Am.Module.load("Util").then(
                        function(result) {
                            expect(Am.Module.get("Util")).to.exist;
                            done();
                        },
                        function(error) {
                            done(error);
                        }
                    );
                });

                it("should throw an exception if the specified module has yet to be loaded", function(done) {
                    expect(Am.Module.get("FakeModule")).to.not.exist;

                    done();
                });
            });

        });
    });
});

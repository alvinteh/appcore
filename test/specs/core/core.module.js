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

                /*
                 * The following tests will fail as BlanketJS throws exceptions on script load errors. Apply the fix at
                 * https://github.com/RickyChien/blanket/commit/0f4d15ed83102c1f589cf4145bbf487286fcc205 to have them
                 * pass
                 */

                if (window.getUrlParam("ignore-timeout").toString() !== "1") {
                    this.timeout(10000);
                }

                it("should reject if the specified module cannot be loaded", function(done) {
                    Am.Module.load("FakeModule1").then(
                        function(result) {
                            done(result);
                        },
                        function(error) {
                            expect(error).to.exist;
                            done();
                        }
                    );
                });

                it("should reject if the specified modules cannot be loaded", function(done) {
                    Am.Module.load(["FakeModule1", "FakeModule2"]).then(
                        function(result) {
                            done(result);
                        },
                        function(error) {
                            expect(error).to.exist;
                            done();
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

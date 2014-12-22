define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Config", function() {

            it("should be defined", function(done) {
                expect(Am.Config).to.exist;

                done();
            });

            describe("get()", function() {
                it("should retrieve configuration data associated with the specified key", function(done) {
                    Am.Config.set("testKey", "testValue")

                    expect(Am.Config.get("testKey")).to.deep.equal("testValue");

                    done();
                });

                it("should retrieve nested configuration data properly", function(done) {
                    Am.Config.set("testKey", {
                        a: "testValueA",
                        b: "testValueB",
                    })

                    expect(Am.Config.get("testKey").a).to.deep.equal("testValueA");
                    expect(Am.Config.get("testKey").b).to.deep.equal("testValueB");

                    done();
                });
            });

            describe("set()", function() {
                it("should set the configuration data with the specified key and value", function(done) {
                    Am.Config.set("testKey", "testValue")

                    expect(Am.Config.get("testKey")).to.deep.equal("testValue");

                    done();
                });

                it("should set nested configuration data properly", function(done) {
                    Am.Config.set("testKey", {
                        a: "testValueA",
                        b: "testValueB",
                    })

                    expect(Am.Config.get("testKey").a).to.deep.equal("testValueA");
                    expect(Am.Config.get("testKey").b).to.deep.equal("testValueB");
                    expect(Am.Config.get("testKey.a")).to.deep.equal("testValueA");
                    expect(Am.Config.get("testKey.b")).to.deep.equal("testValueB");

                    done();
                });
            });

            describe("unset()", function() {
                it("should unset the configuration data associated with the specified key", function(done) {
                    Am.Config.set("testKey", "testValue")
                    Am.Config.unset("testKey");

                    expect(Am.Config.get("testKey")).to.be.undefined;

                    done();
                });
            });
        });
    });
});

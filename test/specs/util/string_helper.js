define(function() {
    var Am = window.Am;

    Am.Module.load("Util").then(function() {
        var StringHelper = Am.Module.get("Util").StringHelper;

        describe("Am", function() {
            describe("Util", function() {
                describe("StringHelper", function() {

                    it("should be defined.", function(done) {
                        expect(StringHelper).to.exist;

                        done();
                    });

                    describe("convertToCamelCase()", function() {
                        it("should convert snake-cased strings to camelCase", function(done) {
                            expect(StringHelper.convertToCamelCase("test_string_here")).to.equal("testStringHere");

                            done();
                        });
                    });

                    describe("convertToSnakeCase()", function() {
                        it("should convert camelCased strings to snake_case", function(done) {
                            expect(StringHelper.convertToSnakeCase("testStringHere")).to.equal("test_string_here");

                            done();
                        });
                    });

                    describe("lowercaseFirst()", function() {
                        it("should convert the first character of the string to lowercase", function(done) {
                            expect(StringHelper.lowercaseFirst("testStringHere")).to.equal("testStringHere");
                            expect(StringHelper.lowercaseFirst("TestStringHere")).to.equal("testStringHere");
                            expect(StringHelper.lowercaseFirst("tEstStringHere")).to.equal("tEstStringHere");
                            expect(StringHelper.lowercaseFirst("TEstStringHere")).to.equal("tEstStringHere");

                            done();
                        });
                    });

                    describe("uppercaseFirst()", function() {
                        it("should convert the first character of the string to uppercase", function(done) {
                            expect(StringHelper.uppercaseFirst("testStringHere")).to.equal("TestStringHere");
                            expect(StringHelper.uppercaseFirst("TestStringHere")).to.equal("TestStringHere");
                            expect(StringHelper.uppercaseFirst("tEstStringHere")).to.equal("TEstStringHere");
                            expect(StringHelper.uppercaseFirst("TEstStringHere")).to.equal("TEstStringHere");

                            done();
                        });
                    });

                    describe("humanize()", function() {
                        it("should humanize camel-cased strings", function(done) {
                            expect(StringHelper.humanize("testStringHere")).to.equal("test string here");

                            done();
                        });

                        it("should humanize snake-cased strings", function(done) {
                            expect(StringHelper.humanize("test_string_here")).to.equal("test string here");

                            done();
                        });
                    });
                });
            });
        });
    });

});

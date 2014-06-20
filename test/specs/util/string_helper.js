define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Util", function() {
            describe("StringHelper", function() {

                it("should be defined.", function(done) {
                    Am.Module.load("Util").then(function() {
                        var StringHelper = Am.Module.get("Util").StringHelper;

                        expect(StringHelper).to.exist;

                        done();
                    });
                });

                describe("convertToCamelCase()", function() {
                    it("should convert snake-cased strings to camelCase", function(done) {
                        Am.Module.load("Util").then(function() {
                            var StringHelper = Am.Module.get("Util").StringHelper;

                            expect(StringHelper.convertToCamelCase("test_string_here")).to.equal("testStringHere");

                            done();
                        });
                    });
                });

                describe("convertToSnakeCase()", function() {
                    it("should convert camelCased strings to snake_case", function(done) {
                        Am.Module.load("Util").then(function() {
                            var StringHelper = Am.Module.get("Util").StringHelper;

                            expect(StringHelper.convertToSnakeCase("testStringHere")).to.equal("test_string_here");

                            done();
                        });
                    });
                });

                describe("lowercaseFirst()", function() {
                    it("should convert the first character of the string to lowercase", function(done) {
                        Am.Module.load("Util").then(function() {
                            var StringHelper = Am.Module.get("Util").StringHelper;

                            var test1 = StringHelper.lowercaseFirst("TestStringHere") === "testStringHere";
                            var test2 = StringHelper.lowercaseFirst("testStringHere") === "testStringHere";
                            var test3 = StringHelper.lowercaseFirst("TEstStringHere") === "tEstStringHere";
                            var test4 = StringHelper.lowercaseFirst("tEstStringHere") === "tEstStringHere";

                            expect(test1 && test2 && test3 && test4).to.be.true;

                            done();
                        });
                    });
                });

                describe("uppercaseFirst()", function() {
                    it("should convert the first character of the string to uppercase", function(done) {
                        Am.Module.load("Util").then(function() {
                            var StringHelper = Am.Module.get("Util").StringHelper;

                            var test1 = StringHelper.uppercaseFirst("TestStringHere") === "TestStringHere";
                            var test2 = StringHelper.uppercaseFirst("testStringHere") === "TestStringHere";
                            var test3 = StringHelper.uppercaseFirst("TEstStringHere") === "TEstStringHere";
                            var test4 = StringHelper.uppercaseFirst("tEstStringHere") === "TEstStringHere";

                            expect(test1 && test2 && test3 && test4).to.be.true;

                            done();
                        });
                    });
                });

                describe("humanize()", function() {
                    it("should humanize camel-cased strings", function(done) {
                        Am.Module.load("Util").then(function() {
                            var StringHelper = Am.Module.get("Util").StringHelper;

                            expect(StringHelper.humanize("testStringHere")).to.equal("test string here");

                            done();
                        });
                    });

                    it("should humanize snake-cased strings", function(done) {
                        Am.Module.load("Util").then(function() {
                            var StringHelper = Am.Module.get("Util").StringHelper;

                            expect(StringHelper.humanize("test_string_here")).to.equal("test string here");

                            done();
                        });
                    });
                });
            });
        });
    });

});

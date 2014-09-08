define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Util", function() {
            describe("FunctionHelper", function() {

                it("should be defined.", function(done) {
                    Am.Module.load("Util").then(function() {
                        var FunctionHelper = Am.Module.get("Util").FunctionHelper;

                        expect(FunctionHelper).to.exist;

                        done();
                    });
                });

                describe("noop()", function() {
                    it("should be an empty function", function(done) {
                        Am.Module.load("Util").then(function() {
                            var FunctionHelper = Am.Module.get("Util").FunctionHelper;

                            expect(FunctionHelper.noop().toString().replace(" ", "")).to.deep.equal("function(){}");

                            done();
                        });
                    });
                });

                describe("override()", function() {
                    it("should override the original function", function(done) {
                        Am.Module.load("Util").then(function() {
                            var FunctionHelper = Am.Module.get("Util").FunctionHelper;

                            var value = 0;

                            var originalFunction = function() {
                                value += 1;
                            };

                            var overridingFunction = FunctionHelper.override(originalFunction, function() {
                                value += 2;
                            });

                            overridingFunction();

                            expect(value).to.deep.equal(2);

                            done();
                        });
                    });

                    it("should be able to call the original function with the appropriate scope and arguments",
                        function(done) {
                        Am.Module.load("Util").then(function() {
                            var FunctionHelper = Am.Module.get("Util").FunctionHelper;

                            var Person = function(age) {
                                this.age = age;

                                this.grow = function(years) {
                                    this.age += years;
                                };
                            };

                            var person = new Person(10);

                            person.grow = FunctionHelper.override(person.grow,
                                function(originalFunction, context, arguments) {

                                context.age = 50;
                                originalFunction.apply(context, arguments);
                            });

                            person.grow(5);

                            expect(person.age).to.deep.equal(55);

                            done();
                        });
                    });
                });
            });
        });
    });

});

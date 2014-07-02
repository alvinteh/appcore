define(function() {
    var Am = window.Am;

    Am.Module.load("Util").then(function() {
        var Predicate = Am.Module.get("Util").Predicate;

        describe("Am", function() {
            describe("Util", function() {
                describe("Predicate", function() {

                    it("should be defined.", function(done) {
                        expect(Predicate).to.exist;

                        done();
                    });

                    describe("normalize()", function() {
                        it("should normalize predicates following the { attr1: val1[,...] } format", function(done) {
                            var predicates = Predicate.normalize({
                                attribute1: true,
                                attribute2: 1,
                                attribute3: "string_value"
                            });

                            expect(predicates[0].getAttribute()).to.equal("attribute1");
                            expect(predicates[0].getValue()).to.equal(true);
                            expect(predicates[0].getOperation()).to.equal("===");

                            expect(predicates[1].getAttribute()).to.equal("attribute2");
                            expect(predicates[1].getValue()).to.equal(1);
                            expect(predicates[1].getOperation()).to.equal("===");

                            expect(predicates[2].getAttribute()).to.equal("attribute3");
                            expect(predicates[2].getValue()).to.equal("string_value");
                            expect(predicates[2].getOperation()).to.equal("===");

                            done();
                        });

                        it("should normalize predicates following the [{ attribute: \"attr1\", value: \"val1\", " +
                            "operation: \"==\"}[,...] } format", function(done) {
                            var testOperation = function(itemValue, predicateValue) {
                                return itemValue.toLowerCase() === predicateValue.toLowerCase();
                            };

                            var predicates = Predicate.normalize([
                                {
                                    attribute: "attribute1",
                                    value: true
                                },
                                {
                                    attribute: "attribute2",
                                    value: 1,
                                    operation: ">"
                                },
                                {
                                    attribute: "attribute3",
                                    value: "string_value",
                                    operation: testOperation
                                }
                            ]);

                            expect(predicates[0].getAttribute()).to.equal("attribute1");
                            expect(predicates[0].getValue()).to.equal(true);
                            expect(predicates[0].getOperation()).to.equal("===");

                            expect(predicates[1].getAttribute()).to.equal("attribute2");
                            expect(predicates[1].getValue()).to.equal(1);
                            expect(predicates[1].getOperation()).to.equal(">");

                            expect(predicates[2].getAttribute()).to.equal("attribute3");
                            expect(predicates[2].getValue()).to.equal("string_value");
                            expect(predicates[2].getOperation()).to.equal(testOperation);

                            done();
                        });
                    });

                    describe("instance.test()", function() {
                        it("should return whether it is satisfied by the tested value", function(done) {
                            var testOperation = function(itemValue, predicateValue) {
                                return itemValue.toLowerCase() === predicateValue.toLowerCase();
                            };

                            var predicates = Predicate.normalize([
                                {
                                    attribute: "attribute1",
                                    value: true
                                },
                                {
                                    attribute: "attribute2",
                                    value: 1,
                                    operation: ">"
                                },
                                {
                                    attribute: "attribute3",
                                    value: "string_value",
                                    operation: testOperation
                                }
                            ]);

                            var item = {};
                            item.get = sinon.stub();

                            item.get.withArgs("attribute1").returns(true);
                            expect(predicates[0].test(item)).to.be.true;
                            item.get.withArgs("attribute1").returns(1);
                            expect(predicates[0].test(item)).to.be.false;
                            item.get.withArgs("attribute1").returns(false);
                            expect(predicates[0].test(item)).to.be.false;

                            item.get.withArgs("attribute2").returns(0);
                            expect(predicates[1].test(item)).to.be.false;
                            item.get.withArgs("attribute2").returns(1);
                            expect(predicates[1].test(item)).to.be.false;
                            item.get.withArgs("attribute2").returns(2);
                            expect(predicates[1].test(item)).to.be.true;

                            predicates[1].setOperation(">=");

                            item.get.withArgs("attribute2").returns(0);
                            expect(predicates[1].test(item)).to.be.false;
                            item.get.withArgs("attribute2").returns(1);
                            expect(predicates[1].test(item)).to.be.true;
                            item.get.withArgs("attribute2").returns(2);
                            expect(predicates[1].test(item)).to.be.true;

                            predicates[1].setOperation("<");

                            item.get.withArgs("attribute2").returns(0);
                            expect(predicates[1].test(item)).to.be.true;
                            item.get.withArgs("attribute2").returns(1);
                            expect(predicates[1].test(item)).to.be.false;
                            item.get.withArgs("attribute2").returns(2);
                            expect(predicates[1].test(item)).to.be.false;

                            predicates[1].setOperation("<=");

                            item.get.withArgs("attribute2").returns(0);
                            expect(predicates[1].test(item)).to.be.true;
                            item.get.withArgs("attribute2").returns(1);
                            expect(predicates[1].test(item)).to.be.true
                            item.get.withArgs("attribute2").returns(2);
                            expect(predicates[1].test(item)).to.be.false;

                            predicates[1].setOperation("==");

                            item.get.withArgs("attribute2").returns(1);
                            expect(predicates[1].test(item)).to.be.true;
                            item.get.withArgs("attribute2").returns("1");
                            expect(predicates[1].test(item)).to.be.true;
                            item.get.withArgs("attribute2").returns(2);
                            expect(predicates[1].test(item)).to.be.false;

                            item.get.withArgs("attribute3").returns("string_value");
                            expect(predicates[2].test(item)).to.be.true;
                            item.get.withArgs("attribute3").returns("STRING_VALUE");
                            expect(predicates[2].test(item)).to.be.true;
                            item.get.withArgs("attribute3").returns("xxx");
                            expect(predicates[2].test(item)).to.be.false;

                            done();
                        });
                    });

                });
            });
        });
    });

});

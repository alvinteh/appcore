define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Event", function() {
            describe("Event", function() {
                describe("Event()", function() {
                    it("shoud accept calls with name and target arguments", function(done) {
                        var person = {};

                        var event = new Am.Event.Event(person, "say");

                        expect(event.get("target")).to.equal(person);
                        expect(event.get("name")).to.equal("say");

                        done();
                    });

                    it("shoud accept calls with name, target and data arguments", function(done) {
                        var person = {};

                        var event = new Am.Event.Event(person, "say", { message: "Hello" });

                        expect(event.get("target")).to.equal(person);
                        expect(event.get("name")).to.equal("say");
                        expect(event.get("data").message).to.equal("Hello");

                        done();
                    });
                });

                describe("instance.get()", function() {
                    it("should return the value of specified attribute", function(done) {
                        var person = {};

                        var event = new Am.Event.Event(person, "say");

                        expect(event.get("target")).to.equal(person);
                        expect(event.get("name")).to.equal("say");

                        done();
                    });
                });

                describe("instance.set()", function() {
                    it("should set the value of specified attribute", function(done) {
                        var personA = {};
                        var personB = {};

                        var event = new Am.Event.Event(personA, "say");

                        event.set("target", personB);
                        event.setName("test");

                        expect(event.get("target")).to.equal(personB);
                        expect(event.get("name")).to.equal("test");

                        done();
                    });

                    it("should set the value of specified attributes", function(done) {
                        var personA = {};
                        var personB = {};

                        var event = new Am.Event.Event(personA, "say");

                        event.set({
                            target: personB,
                            name: "test"
                        });

                        expect(event.get("target")).to.equal(personB);
                        expect(event.get("name")).to.equal("test");


                        done();
                    });
                });

                describe("instance.has()", function() {
                    it("should check whether the specified attribute exists", function(done) {
                        var person = {};

                        var event = new Am.Event.Event(person, "say");

                        expect(event.has("name")).to.be.true;
                        expect(event.has("fakeAttribute")).to.be.false;

                        done();
                    });
                });

                describe("instance.toObject()", function() {
                    it("should return an object representation of the caller", function(done) {
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("John");

                        var event = new Am.Event.Event(person, "say", { message: "Hello" });
                        var object = event.toObject();

                        expect(object.target.name).to.equal(person.get("name"));
                        expect(object.name).to.equal("say");
                        expect(object.data.message).to.equal("Hello");

                        done();
                    });
                });
            });
        });
    });
});

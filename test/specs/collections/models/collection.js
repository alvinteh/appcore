define(function() {
    var Am = window.Am;

    Am.Module.load("Collections").then(function() {
        var Collection = Am.Module.get("Collections").Collection;

        describe("Am", function() {
            describe("Collections", function() {
                describe("Collection", function() {
                    var Person;

                    before(function() {
                         Person = Am.Model.create("Person", ["firstName", "lastName"]);
                    });

                    it("should be defined.", function(done) {
                        expect(Collection).to.exist;

                        done();
                    });

                    describe("Collection()", function() {
                        it("should create a Collection when provided the name and model arguments", function(done) {
                            var collection = new Collection("people", Person);

                            expect(collection.get("name")).to.equal("people");
                            expect(collection.get("model")).to.equal(Person);
                            expect(collection.get("items")).to.have.length(0);

                            done();
                        });
                    });

                    describe("addItem()", function() {
                        it("should add the specified item to the Collection", function(done) {
                            var collection = new Collection("people", Person);

                            var peopleArray = [
                                new Person("John", "Doe"),
                                new Person("Alan", "Johnson")
                            ];
                            collection.addItem(peopleArray[0]);
                            collection.addItem(peopleArray[1]);

                            var items = collection.get("items");

                            expect(collection.get("itemCount")).to.equal(2);
                            expect(items[1]).to.equal(peopleArray[0]);
                            expect(items[2]).to.equal(peopleArray[1]);

                            done();
                        });

                        it("should set the specified item's Id if it is null/undefined", function(done) {
                            var collection = new Collection("people", Person);

                            var person = new Person("John", "Doe");
                            collection.addItem(person);

                            var items = collection.get("items");

                            expect(items[1].get("id")).to.equal(1);
                            expect(person.get("id")).to.equal(1);

                            done();
                        });

                        it("should not set the specified item's Id if it is not null/undefined", function(done) {
                            var collection = new Collection("people", Person);

                            var person = new Person("John", "Doe");
                            person.set("id", 3);
                            collection.addItem(person);

                            var items = collection.get("items");

                            expect(items[3].get("id")).to.equal(3);
                            expect(person.get("id")).to.equal(3);

                            done();
                        });

                        it("should trigger the item_add event on the collection", function(done) {
                            var collection = new Collection("people", Person);

                            Am.Event.observe(collection, "item_add", function() {
                                done();
                            });

                            var person = new Person("John", "Doe");
                            collection.addItem(person);
                        });

                        it("should ignore additions of the same item", function(done) {
                            var collection = new Collection("people", Person);

                            var i = 0;

                            Am.Event.observe(collection, "item_add", function() {
                                i++;
                            });

                            var person = new Person("John", "Doe");
                            collection.addItem(person);
                            collection.addItem(person);

                            expect(person.get("id")).to.equal(1);
                            expect(collection.get("itemCount")).to.equal(1);
                            expect(i).to.equal(1);

                            done();
                        });
                    });

                    describe("removeItem()", function() {
                        it("should remove the specified item from the collection", function(done) {
                            var collection = new Collection("people", Person);

                            var person = new Person("John", "Doe");

                            collection.addItem(person);
                            collection.removeItem(person);

                            var items = collection.get("items");

                            expect(collection.get("itemCount")).to.equal(0);
                            expect(items[1]).to.be.undefined;

                            done();
                        });

                        it("should trigger the item_remove event on the collection", function(done) {
                            var collection = new Collection("people", Person);

                            var person = new Person("John", "Doe");

                            Am.Event.observe(collection, "item_remove", function() {
                                done();
                            });

                            collection.addItem(person);
                            collection.removeItem(person);
                        });

                        it("should not throw errors if the specified item does not exist in the collection",
                            function(done) {
                            var collection = new Collection("people", Person);

                            var person = new Person("John", "Doe");
                            var i = 0;

                            Am.Event.observe(collection, "item_remove", function() {
                                i++;
                            });

                            expect(function() { collection.removeItem(person); }).to.not.throw();

                            var items = collection.get("items");

                            expect(collection.get("itemCount")).to.equal(0);
                            expect(items[1]).to.be.undefined;
                            expect(i).to.equal(0);

                            done();
                        });
                    });

                    describe("findItem()", function() {
                        it("should retrieve the item matching the specified Id", function(done) {
                            var collection = new Collection("people", Person);

                            var person = new Person("John", "Doe");
                            collection.addItem(person);

                            expect(collection.findItem(1)).to.equal(person);

                            done();
                        });

                        it("should not throw errors if the specified item does not exist in the collection",
                            function(done) {
                            var collection = new Collection("people", Person);

                            expect(collection.findItem(1)).to.be.null;

                            done();
                        });
                    });
                });
            });
        });
    });

});

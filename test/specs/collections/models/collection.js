define(function() {
    var Am = window.Am;

    Am.Module.load("Collections")
        .then(Am.Module.load("Util"))
        .then(function() {
        var Collection = Am.Module.get("Collections").Collection;
        var Predicate = Am.Module.get("Util").Predicate;

        describe("Am", function() {
            describe("Collections", function() {
                describe("Collection", function() {
                    var Person;

                    before(function() {
                        Person = Am.Model.create("Person", ["firstName", "lastName", "age"]);
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

                            Am.Event.observe(collection, "item_add", function(event) {
                                expect(event.getTarget()).to.equal(collection);
                                expect(event.getData().item).to.equal(person);

                                done();
                            });

                            var person = new Person("John", "Doe");
                            collection.addItem(person);
                        });

                        it("should trigger the item_change event on the collection when changes are made to the " +
                            "specified item", function(done) {
                            var collection = new Collection("people", Person);

                            Am.Event.observe(collection, "item_change", function(event) {
                                expect(event.getTarget()).to.equal(collection);
                                expect(event.getData().item).to.equal(person);

                                var changes = event.getData().changes;
                                expect(changes[0].attribute).to.equal("firstName");
                                expect(changes[0].newValue).to.equal("Johnny");
                                expect(changes[0].oldValue).to.equal("John");

                                done();
                            });

                            var person = new Person("John", "Doe");
                            collection.addItem(person);

                            person.set("firstName", "Johnny");
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

                    describe("getNextAutoIncrementNo()", function() {
                        it("should return the next auto increment number", function(done) {
                            var collection = new Collection("people", Person);

                            var person = new Person("John", "Doe");
                            collection.addItem(person);

                            expect(collection.getNextAutoIncrementNo()).to.equal(2);
                            expect(collection.getNextAutoIncrementNo()).to.equal(3);

                            done();
                        });
                    });

                    describe("resetNextAutoIncrementNo()", function() {
                        it("should", function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("John", "Doe");
                            collection.addItem(person1);
                            collection.resetAutoIncrementNo();
                            collection.addItem(person2);

                            expect(collection.get("itemCount")).to.equal(1);
                            expect(collection.get("items")[1]).to.equal(person2);
                            expect(collection.get("items")[2]).to.be.undefined;

                            done();
                        });
                    });

                    describe("hasItem()", function() {
                        it("should return true if the items exists in the collection", function(done) {
                            var collection = new Collection("people", Person);

                            var person = new Person("John", "Doe");
                            collection.addItem(person);

                            expect(collection.hasItem(person)).to.be.true;

                            done();
                        });

                        it("should return false if the item does not exist in the collection", function(done) {
                            var collection = new Collection("people", Person);

                            var person = new Person("John", "Doe");

                            expect(collection.hasItem(person)).to.be.false;

                            done();
                        });
                    });

                    describe("hasItemLike()", function() {
                        it("should return true if there is at least one item matching the specified attribute/value",
                            function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);

                            expect(collection.hasItemLike("firstName", "John")).to.be.true;

                            done();
                        });

                        it("should return false if there are no items matching the specified attribute/value",
                            function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);

                            expect(collection.hasItemLike("firstName", "Johnny")).to.be.false;

                            done();
                        });
                    });

                    describe("hasItemWhere()", function() {
                        it("should return true if there is at least one item satisfying the specified predicate",
                            function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);

                            expect(collection.hasItemWhere(Predicate.normalize({ firstName: "John" }))).to.be.true;

                            done();
                        });

                        it("should return false if there are no items satisfying the specified predicate",
                            function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);

                            expect(collection.hasItemWhere(Predicate.normalize({ firstName: "Johnny" }))).to.be.false;

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

                    describe("findOrAddItem()", function() {
                        it("should retrieve the item matching the specified attribute if it exists in the " +
                            "collection", function(done) {
                            var collection = new Collection("people", Person);

                            var person = new Person("John", "Doe");
                            collection.addItem(person);

                            expect(collection.findOrAddItem("id", person)).to.equal(person);

                            done();
                        });

                        it("should add the specified item if no matching item exists in the collection",
                            function(done) {
                            var collection = new Collection("people", Person);

                            var person = new Person("John", "Doe");
                            collection.findOrAddItem("id", person);

                            var items = collection.get("items");

                            expect(items[1].get("id")).to.equal(1);
                            expect(person.get("id")).to.equal(1);

                            done();
                        });
                    });

                    describe("findItemLike()", function() {
                        it("should retrieve exactly one item matching the specified attribute/value", function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);

                            var item = collection.findItemLike("firstName", "John");

                            expect(item).to.equal(person1);

                            done();
                        });
                    });

                    describe("findItemsLike()", function() {
                        it("should retrieve all items matching the specified attribute/value", function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);

                            var items = collection.findItemsLike("firstName", "John");

                            expect(items).to.have.length(2);
                            expect(items[0]).to.equal(person1);
                            expect(items[1]).to.equal(person4);

                            done();
                        });
                    });

                    describe("findItemWhere()", function() {
                        it("should retrieve exactly one item satisfying the specified predicate", function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);

                            var item = collection.findItemWhere(Predicate.normalize({ firstName: "John" }));

                            expect(item).to.equal(person1);

                            done();
                        });

                        it("should return null if no items satisfy the specified predicate", function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);

                            var item = collection.findItemWhere(Predicate.normalize({ firstName: "Johnny" }));

                            expect(item).to.be.null;

                            done();
                        });
                    });

                    describe("findItemsWhere()", function() {
                        it("should retrieve all items satisfying the specified predicate", function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);

                            var items = collection.findItemsWhere(Predicate.normalize({ firstName: "John" }));

                            expect(items).to.have.length(2);
                            expect(items[0]).to.equal(person1);
                            expect(items[1]).to.equal(person4);

                            done();
                        });
                    });

                    describe("findItemsBetween()", function() {
                        it("should retrieve all items with values between the specified attribute/value (inclusive)",
                            function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe", 20);
                            var person2 = new Person("Alan", "Johnson", 21);
                            var person3 = new Person("Mary", "Jane", 15);
                            var person4 = new Person("John", "Cox", 10);

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);

                            var items = collection.findItemsBetween("age", 15, 21);

                            expect(items).to.have.length(3);
                            expect(items[0]).to.equal(person1);
                            expect(items[1]).to.equal(person2);
                            expect(items[2]).to.equal(person3);

                            done();
                        });
                    });

                    describe("removeItemLike()", function() {
                        it("should remove exactly one item matching the specified attribute/value", function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);
                            collection.removeItemLike("firstName", "John");

                            var items = collection.get("items");

                            expect(collection.get("itemCount")).to.equal(3);
                            expect(items[1]).to.be.undefined;
                            expect(items[2]).to.equal(person2);
                            expect(items[3]).to.equal(person3);
                            expect(items[4]).to.equal(person4);

                            done();
                        });
                    });

                    describe("removeItemsLike()", function() {
                        it("should remove all items matching the specified attribute/value", function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);
                            collection.removeItemsLike("firstName", "John");

                            var items = collection.get("items");

                            expect(collection.get("itemCount")).to.equal(2);
                            expect(items[1]).to.be.undefined;
                            expect(items[2]).to.equal(person2);
                            expect(items[3]).to.equal(person3);
                            expect(items[4]).to.be.undefined;

                            done();
                        });
                    });

                    describe("removeItemWhere()", function() {
                        it("should remove exactly one item satisfying the specified predicate", function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);
                            collection.removeItemWhere(Predicate.normalize({ firstName: "John" }));

                            var items = collection.get("items");

                            expect(collection.get("itemCount")).to.equal(3);
                            expect(items[1]).to.be.undefined;
                            expect(items[2]).to.equal(person2);
                            expect(items[3]).to.equal(person3);
                            expect(items[4]).to.equal(person4);

                            collection.removeItemWhere(Predicate.normalize({ firstName: "Johnny" }));

                            items = collection.get("items");

                            expect(collection.get("itemCount")).to.equal(3);
                            expect(items[1]).to.be.undefined;
                            expect(items[2]).to.equal(person2);
                            expect(items[3]).to.equal(person3);
                            expect(items[4]).to.equal(person4);

                            done();
                        });
                    });

                    describe("removeItemsWhere()", function() {
                        it("should remove all items satisfying the specified predicate", function(done) {
                            var collection = new Collection("people", Person);

                            var person1 = new Person("John", "Doe");
                            var person2 = new Person("Alan", "Johnson");
                            var person3 = new Person("Mary", "Jane");
                            var person4 = new Person("John", "Cox");

                            collection.addItem(person1);
                            collection.addItem(person2);
                            collection.addItem(person3);
                            collection.addItem(person4);
                            collection.removeItemsWhere(Predicate.normalize({ firstName: "John" }));

                            var items = collection.get("items");

                            expect(collection.get("itemCount")).to.equal(2);
                            expect(items[1]).to.be.undefined;
                            expect(items[2]).to.equal(person2);
                            expect(items[3]).to.equal(person3);
                            expect(items[4]).to.be.undefined;

                            done();
                        });
                    });
                });
            });
        });
    });

});


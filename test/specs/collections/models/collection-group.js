define(function() {
    var Am = window.Am;

    Am.Module.load("Collections")
        .then(Am.Module.load("Persistence"))
        .then(function() {
        var CollectionGroup = Am.Module.get("Collections").CollectionGroup;
        var Collection = Am.Module.get("Collections").Collection;
        var RestSyncer = Am.Module.get("Persistence").RestSyncer;

        describe("Am", function() {
            describe("Collections", function() {
                describe("CollectionGroup", function() {
                    var Person;
                    var personCollection;
                    var Job;
                    var jobCollection;

                    before(function() {
                        Person = Am.Model.create("Person", ["firstName", "lastName"]);
                        Job = Am.Model.create("Job", ["name"]);
                    });

                    beforeEach(function() {
                        personCollection = new Collection("people", Person);
                        jobCollection = new Collection("jobs", Job);
                    });

                    it("should be defined.", function(done) {
                        expect(CollectionGroup).to.exist;

                        done();
                    });

                    describe("CollectionGroup()", function() {
                        it("should create a CollectionGroup when provided the name argument", function(done) {
                            var collectionGroup = new CollectionGroup("default");

                            expect(collectionGroup.get("name")).to.equal("default");
                            expect(collectionGroup.get("syncer")).to.be.null;

                            done();
                        });

                        it("should create a CollectionGroup when provided the name and syncer arguments",
                            function(done) {
                            var syncer = new RestSyncer("http://test");
                            var collectionGroup = new CollectionGroup("default", syncer);

                            expect(collectionGroup.get("name")).to.equal("default");
                            expect(collectionGroup.get("syncer")).to.equal(syncer);

                            done();
                        });
                    });

                    describe("instance.getCollection()", function() {
                        it("should retrieve the collection with the specified name", function(done) {
                            var collectionGroup = new CollectionGroup("default");
                            collectionGroup.addCollection(personCollection);

                            expect(collectionGroup.getCollection("people")).to.equal(personCollection);

                            done();
                        });

                        it("should return undefined if the specified collection does not exist", function(done) {
                            var collectionGroup = new CollectionGroup("default");

                            expect(collectionGroup.getCollection("people")).to.be.underfined;

                            done();
                        });
                    });

                    describe("instance.addCollection()", function() {
                        it("should add the specified collection to the collection group", function(done) {
                            var collectionGroup = new CollectionGroup("default");
                            collectionGroup.addCollection(personCollection);

                            expect(collectionGroup.getCollection("people")).to.equal(personCollection);

                            done();
                        });

                        it("should ignore duplicate collections", function(done) {
                            var collectionGroup = new CollectionGroup("default");
                            collectionGroup.addCollection(personCollection);
                            collectionGroup.addCollection(personCollection);
                            collectionGroup.removeCollection(personCollection);

                            expect(collectionGroup.getCollection("people")).to.not.exist;

                            done();
                        });

                        it("should trigger the item_add event when items are added to the collection", function(done) {
                            var collectionGroup = new CollectionGroup("default");
                            collectionGroup.addCollection(personCollection);

                            Am.Event.observe(collectionGroup, "item_add", function(event) {
                                expect(event.getTarget()).to.equal(collectionGroup);
                                expect(event.getData().collection).to.equal(personCollection);
                                expect(event.getData().item).to.equal(person);
                                done();
                            });

                            var person = new Person("John", "Doe");
                            personCollection.addItem(person);
                        });

                        it("should trigger the item_change event when changes are made to items in the collection",
                            function(done) {
                            var collectionGroup = new CollectionGroup("default");
                            collectionGroup.addCollection(personCollection);

                            Am.Event.observe(collectionGroup, "item_change", function(event) {
                                expect(event.getTarget()).to.equal(collectionGroup);
                                expect(event.getData().collection).to.equal(personCollection);
                                expect(event.getData().item).to.equal(person);

                                var changes = event.getData().changes;
                                expect(changes[0].attribute).to.equal("firstName");
                                expect(changes[0].newValue).to.equal("Johnny");
                                expect(changes[0].oldValue).to.equal("John");
                                done();
                            });

                            var person = new Person("John", "Doe");
                            personCollection.addItem(person);
                            person.set("firstName", "Johnny");
                        });

                        it("should trigger the item_remove event when items are removed from the collection",
                            function(done) {
                            var collectionGroup = new CollectionGroup("default");
                            collectionGroup.addCollection(personCollection);

                            Am.Event.observe(collectionGroup, "item_remove", function(event) {
                                expect(event.getTarget()).to.equal(collectionGroup);
                                expect(event.getData().collection).to.equal(personCollection);
                                expect(event.getData().item).to.equal(person);
                                done();
                            });

                            var person = new Person("John", "Doe");
                            personCollection.addItem(person);
                            personCollection.removeItem(person);
                        });
                    });

                    describe("instance.removeCollection()", function() {
                        it("should remove the specified collection from the collection group", function(done) {
                            var collectionGroup = new CollectionGroup("default");
                            collectionGroup.addCollection(personCollection);
                            collectionGroup.removeCollection(personCollection);

                            expect(collectionGroup.getCollection("people")).to.be.undefined;

                            done();
                        });

                        it("should ignore non-existent collections", function(done) {
                            var collectionGroup = new CollectionGroup("default");
                            collectionGroup.removeCollection(personCollection);

                            expect(collectionGroup.getCollection("people")).to.not.exist;

                            done();
                        });

                        it("should stop triggering of the item_add event when items are added to the collection",
                            function(done) {
                            var collectionGroup = new CollectionGroup("default");
                            collectionGroup.addCollection(personCollection);

                            var test = true;

                            Am.Event.observe(collectionGroup, "item_add", function() {
                                test = false;
                            });

                            collectionGroup.removeCollection(personCollection);

                            var person = new Person("John", "Doe");
                            personCollection.addItem(person);

                            setTimeout(function() {
                                expect(test).to.be.true;
                                done();
                            }, 0);
                        });

                        it("should trigger the item_change event when changes are made to items in the collection",
                            function(done) {
                            var collectionGroup = new CollectionGroup("default");
                            collectionGroup.addCollection(personCollection);

                            var test = true;

                            Am.Event.observe(collectionGroup, "item_change", function() {
                                test = false;
                            });

                            collectionGroup.removeCollection(personCollection);

                            var person = new Person("John", "Doe");
                            personCollection.addItem(person);
                            person.set("firstName", "Johnny");

                            setTimeout(function() {
                                expect(test).to.be.true;
                                done();
                            }, 0);
                        });

                        it("should trigger the item_remove event when items are removed from the collection",
                            function(done) {
                            var collectionGroup = new CollectionGroup("default");
                            collectionGroup.addCollection(personCollection);

                            var test = true;

                            Am.Event.observe(collectionGroup, "item_remove", function(event) {
                                test = false;
                            });

                            collectionGroup.removeCollection(personCollection);

                            var person = new Person("John", "Doe");
                            personCollection.addItem(person);
                            personCollection.removeItem(person);

                            setTimeout(function() {
                                expect(test).to.be.true;
                                done();
                            }, 0);
                        });
                    });
                });
            });
        });
    });
});

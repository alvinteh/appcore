define(function() {
    var Am = window.Am;

    Am.Module.load("Persistence")
        .then(function() {
        var Syncer = Am.Module.get("Persistence").Syncer;

        describe("Am", function() {
            describe("Persistence", function() {
                describe("Syncer", function() {
                    var Person;

                    before(function() {
                        Person = Am.Model.create("Person", ["firstName", "lastName"]);
                    });

                    it("should be defined.", function(done) {
                        expect(Syncer).to.exist;

                        done();
                    });

                    describe("instance.map()", function() {
                        it("should map the specified model and action to the specified endpoint ", function(done) {
                            var syncer = new Syncer();

                            syncer.map(Person, Syncer.ACTION_READ, "people/view");

                            expect(syncer.get("map").Person[Syncer.ACTION_READ]).to.equal("people/view");

                            done();
                        });
                    });

                    describe("instance.getSyncStatus()", function() {
                        it("should return the sync status of the item if it has been set previously", function(done) {
                            var syncer = new Syncer();

                            var person = new Person("John", "Doe");

                            syncer.setSyncStatus(person, Syncer.STATUS_CREATED);

                            expect(syncer.getSyncStatus(person)).to.equal(Syncer.STATUS_CREATED);

                            done();
                        });

                        it("should return undefined if the item has not had its sync status set", function(done) {
                            var syncer = new Syncer();

                            var person = new Person("John", "Doe");

                            expect(syncer.getSyncStatus(person)).to.be.null;

                            done();
                        });
                    });

                    describe("instance.setSyncStatus()", function() {
                        it("should set the sync status of the item", function(done) {
                            var syncer = new Syncer();

                            var person = new Person("John", "Doe");

                            syncer.setSyncStatus(person, Syncer.STATUS_CREATED);

                            expect(syncer.getSyncStatus(person)).to.equal(Syncer.STATUS_CREATED);

                            syncer.setSyncStatus(person, Syncer.STATUS_UPDATED);

                            expect(syncer.getSyncStatus(person)).to.equal(Syncer.STATUS_UPDATED);

                            done();
                        });
                    });
                });
            });
        });
    });
});

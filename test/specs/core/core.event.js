define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Event", function() {
            it("should be defined", function(done) {
                expect(Am.Event).to.exist;

                done();
            });

            describe("trigger()", function() {
                it("should cause the observe() listeners for the appropriate object/event to fire", function(done) {
                    var Person = Am.Model.create("Person", ["name"]);

                    Person.addMethod("shout", function(message) {
                        this.trigger("shout", { message: message });
                    });

                    Person.addMethod("whisper", function(message) {
                        this.trigger("whisper", { message: message });
                    });

                    var personA = new Person("John");
                    var personB = new Person("Alan");

                    var hasTriggeredAShout = false;
                    var hasTriggeredBShout = false;
                    var hasTriggeredAWhisper = false;
                    var hasTriggeredBWhisper = false;

                    Am.Event.observe(personA, "shout", function() {
                        hasTriggeredAShout = true;
                    });

                    Am.Event.observe(personB, "shout", function() {
                        hasTriggeredBShout = true;
                    });

                    Am.Event.observe(personA, "whisper", function() {
                        hasTriggeredAWhisper = true;
                    });

                    Am.Event.observe(personB, "whisper", function() {
                        hasTriggeredBWhisper = true;
                    });

                    personA.shout("Hello");

                    expect(hasTriggeredAShout).to.be.true;
                    expect(hasTriggeredBShout).to.be.false;
                    expect(hasTriggeredAWhisper).to.be.false;
                    expect(hasTriggeredBWhisper).to.be.false;

                    hasTriggeredAShout = false;

                    personB.whisper("Shh");

                    expect(hasTriggeredAShout).to.be.false;
                    expect(hasTriggeredBShout).to.be.false;
                    expect(hasTriggeredAWhisper).to.be.false;
                    expect(hasTriggeredBWhisper).to.be.true;

                    done();
                });

                it("should not throw errors if there are no event listeners for the specified object", function(done) {
                    var Person = Am.Model.create("Person", ["name"]);

                    Person.addMethod("say", function(message) {
                        this.trigger("say", { message: message });
                    });

                    var person = new Person("John");

                    expect(function() { person.say("Hello"); }).to.not.throw();

                    done();
                });

                it("should not throw errors if there are no event listeners for the specified event", function(done) {
                    var Person = Am.Model.create("Person", ["name"]);

                    Person.addMethod("say", function(message) {
                        this.trigger("say", { message: message });
                    });

                    var person = new Person("John");

                    Am.Event.observe(person, "fakeEvent", function() {});

                    expect(function() { person.say("Hello"); }).to.not.throw();

                    done();
                });


            });

            describe("observe()", function() {
                it("should return an Event with the correct target when fired", function(done) {
                    var Person = Am.Model.create("Person", ["name"]);
                    var person = new Person("John");

                    var eventTarget = null;

                    Person.addMethod("say", function(message) {
                        this.trigger("say", { message: message });
                    });

                    Am.Event.observe(person, "say", function(event) {
                        eventTarget = event.getTarget();
                    });

                    person.say("Hello");

                    expect(eventTarget).to.equal(person);

                    done();
                });

                it("should return an Event with the correct event data when fired", function(done) {
                    var Person = Am.Model.create("Person", ["name"]);
                    var person = new Person("John");

                    var eventData = null;

                    Person.addMethod("say", function(message) {
                        this.trigger("say", { message: message });
                    });

                    Am.Event.observe(person, "say", function(event) {
                        eventData = event.getData();
                    });

                    person.say("Hello");

                    expect(eventData.message).to.equal("Hello");

                    done();
                });
            });

            describe("unobserve()", function() {
                it("should cause the appropriate observe() listener(s) to stop firing", function(done) {
                    var Person = Am.Model.create("Person", ["name"]);

                    Person.addMethod("shout", function(message) {
                        this.trigger("shout", { message: message });
                    });

                    Person.addMethod("whisper", function(message) {
                        this.trigger("whisper", { message: message });
                    });

                    var person = new Person("John");

                    var shoutTrigger = 0;
                    var whisperTrigger = 0;

                    var shoutListener1 = function() {
                        shoutTrigger += 1;
                    };

                    Am.Event.observe(person, "shout", shoutListener1);

                    Am.Event.observe(person, "shout", function() {
                        shoutTrigger += 2;
                    });

                    Am.Event.observe(person, "whisper", function() {
                       whisperTrigger += 1;
                    });

                    Am.Event.observe(person, "whisper", function() {
                        whisperTrigger += 2;
                    });

                    Am.Event.unobserve(person, "shout", shoutListener1);

                    person.shout("Hello");
                    person.whisper("Hello");

                    expect(shoutTrigger).to.equal(2);
                    expect(whisperTrigger).to.equal(3);

                    shoutTrigger = 0;
                    whisperTrigger = 0;

                    Am.Event.unobserve(person, "whisper", shoutListener1);

                    person.shout("Hello");
                    person.whisper("Hello");

                    expect(shoutTrigger).to.equal(2);
                    expect(whisperTrigger).to.equal(3);

                    shoutTrigger = 0;
                    whisperTrigger = 0;

                    Am.Event.unobserve(person, "whisper");

                    person.shout("Hello");
                    person.whisper("Hello");

                    expect(shoutTrigger).to.equal(2);
                    expect(whisperTrigger).to.equal(0);

                    done();
                });

                it("should not throw errors if there are no event listeners for the specified object", function(done) {
                    var Person = Am.Model.create("Person", ["name"]);

                    Person.addMethod("say", function(message) {
                        this.trigger("say", { message: message });
                    });

                    var person = new Person("John");

                    expect(function() { Am.Event.unobserve(person, "say"); }).to.not.throw();

                    done();
                });

                it("should not throw errors if there are no event listeners for the specified event", function(done) {
                    var Person = Am.Model.create("Person", ["name"]);

                    var person = new Person("John");

                    Am.Event.observe(person, "say", function() {
                        //Do something
                    });

                    expect(function() { Am.Event.unobserve(person, "say", function() {}); }).to.not.throw();

                    expect(function() { Am.Event.unobserve(person, "fakeEvent"); }).to.not.throw();

                    done();
                });
            });
        });
    });
});

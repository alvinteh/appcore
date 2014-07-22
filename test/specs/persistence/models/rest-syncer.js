define(function() {
    var Am = window.Am;

    Am.Module.load("Persistence")
        .then(Am.Module.load("Ajax"))
        .then(Am.Module.load("Util"))
        .then(function() {
        var Predicate = Am.Module.get("Util").Predicate;
        var RestSyncer = Am.Module.get("Persistence").RestSyncer;
        var Syncer = Am.Module.get("Persistence").Syncer;
        var Xhr = Am.Module.get("Ajax").Xhr;

        describe("Am", function() {
            describe("Persistence", function() {
                describe("RestSyncer", function() {
                    var Person;
                    var server;

                    before(function() {
                        Person = Am.Model.create("Person", ["firstName", "lastName"]);
                    });

                    beforeEach(function() {
                        server = sinon.fakeServer.create();
                        server.autoRespond = true;
                    });

                    afterEach(function() {
                        server.restore();
                    });

                    it("should be defined", function(done) {
                        expect(RestSyncer).to.exist;

                        done();
                    });

                    describe("RestSyncer()", function() {
                        it("should create a RestSyncer when provided the root URL argument", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            expect(restSyncer.get("rootUrl")).to.equal("http://test");

                            done();
                        });
                    });

                    describe("instance.map()", function() {
                        it("should map the specified model and action to the specified URL if the specified endpoint " +
                           "is a string", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            restSyncer.map(Person, Syncer.ACTION_READ, "people/view");

                            var personMap = restSyncer.get("map")["Person"][Syncer.ACTION_READ];

                            expect(personMap.url).to.equal("people/view");
                            expect(personMap.method).to.be.null;

                            done();
                        });

                        it("should map the specified model and action to the specified URL and HTTP method if the " +
                           "specified endpoint is an object (with url and method properties)", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            restSyncer.map(Person, Syncer.ACTION_READ, { url: "people/view", method: Xhr.METHOD_GET });

                            var personMap = restSyncer.get("map")["Person"][Syncer.ACTION_READ];

                            expect(personMap.url).to.equal("people/view");
                            expect(personMap.method).to.equal(Xhr.METHOD_GET);

                            done();
                        });
                    });

                    describe("instance.load()", function() {
                        it("should return a Promise with the loaded item if a single object is returned", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            server.respondWith(function(xhr) {
                                xhr.respond(200, null, JSON.stringify(
                                    {
                                        first_name: "John",
                                        last_name: "Doe"
                                    }
                                ));
                            });

                            restSyncer.load(Person).then(function(itemArray) {
                                expect(itemArray).to.have.length(1);
                                expect(itemArray[0].get("firstName")).to.equal("John");
                                expect(itemArray[0].get("lastName")).to.equal("Doe");
                                done();
                            });
                        });

                        it("should return a Promise with the loaded items if an Array is returned", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            server.respondWith(function(xhr) {
                                xhr.respond(200, null, JSON.stringify([
                                    {
                                        first_name: "John",
                                        last_name: "Doe"
                                    },
                                    {
                                        first_name: "Alan",
                                        last_name: "Sawyer"
                                    }
                                ]));
                            });

                            restSyncer.load(Person).then(function(itemArray) {
                                expect(itemArray).to.have.length(2);
                                expect(itemArray[0].get("firstName")).to.equal("John");
                                expect(itemArray[0].get("lastName")).to.equal("Doe");
                                expect(itemArray[1].get("firstName")).to.equal("Alan");
                                expect(itemArray[1].get("lastName")).to.equal("Sawyer");
                                done();
                            });
                        });

                        it("should return a rejected Promise if invalid JSON is returned", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            server.respondWith(function(xhr) {
                                xhr.respond(200, null, "invalid");
                            });

                            restSyncer.load(Person).then(
                                function() {
                                    done("Should not be here");
                                },
                                function() {
                                    done();
                                }
                            );
                        });

                        it("should return a rejected Promise if an invalid HTTP status is returned", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            server.respondWith(function(xhr) {
                                xhr.respond(404, null, "i");
                            });

                            restSyncer.load(Person).then(
                                function() {
                                    done("Should not be here");
                                },
                                function() {
                                    done();
                                }
                            );
                        });

                        it("should return a rejected Promise if problems occur with the AJAX request", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var tmp = window.XMLHttpRequest;
                            window.XMLHttpRequest = null;

                            server.respondWith(function(xhr) {
                                xhr.respond(404, null, "i");
                            });

                            restSyncer.load(Person).then(
                                function() {
                                    window.XMLHttpRequest = tmp;
                                    server = sinon.fakeServer.create();
                                    done("Should not be here");
                                },
                                function() {
                                    window.XMLHttpRequest = tmp;
                                    server = sinon.fakeServer.create();
                                    done();
                                }
                            );
                        });

                        it("should pass the predicates in the request URL, if there are any specified", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var tmpXhr;

                            server.respondWith(function(xhr) {
                                tmpXhr = xhr;
                                xhr.respond(200, null, JSON.stringify([
                                    {
                                        first_name: "John",
                                        last_name: "Doe"
                                    }
                                ]));
                            });

                            restSyncer.load(Person, Predicate.normalize({ firstName: "John", lastName: "Doe" }))
                                .then(function() {
                                expect(tmpXhr.url).to.equal("http://test/person?first_name=John&last_name=Doe");
                                done();
                            });
                        });

                        it("should correctly interpret a single predicate with the ID attribute", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var tmpXhr;

                            server.respondWith(function(xhr) {
                                tmpXhr = xhr;
                                xhr.respond(200, null, JSON.stringify(
                                    {
                                        id: 1,
                                        first_name: "John",
                                        last_name: "Doe"
                                    }
                                ));
                            });

                            restSyncer.load(Person, Predicate.normalize({ id: 1 })).then(function(itemArray) {
                                expect(tmpXhr.url).to.equal("http://test/person/1");
                                expect(itemArray).to.have.length(1);
                                expect(itemArray[0].get("firstName")).to.equal("John");
                                expect(itemArray[0].get("lastName")).to.equal("Doe");
                                done();
                            });
                        });

                        it("should use specific mapped URLs if they are available", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var tmpXhr;

                            server.respondWith(function(xhr) {
                                tmpXhr = xhr;
                                xhr.respond(200, null, JSON.stringify(
                                    {
                                        first_name: "John",
                                        last_name: "Doe"
                                    }
                                ));
                            });

                            restSyncer.map(Person, Syncer.ACTION_READ, "people/view");

                            restSyncer.load(Person).then(function(itemArray) {
                                expect(tmpXhr.url).to.equal("http://test/people/view");
                                expect(itemArray).to.have.length(1);
                                expect(itemArray[0].get("firstName")).to.equal("John");
                                expect(itemArray[0].get("lastName")).to.equal("Doe");
                                done();
                            });
                        });

                        it("should use generic mapped URLs if they are available", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var tmpXhr;

                            server.respondWith(function(xhr) {
                                tmpXhr = xhr;
                                xhr.respond(200, null, JSON.stringify(
                                    {
                                        first_name: "John",
                                        last_name: "Doe"
                                    }
                                ));
                            });

                            restSyncer.map(Person, "*", "users");

                            restSyncer.load(Person).then(function(itemArray) {
                                expect(tmpXhr.url).to.equal("http://test/users");
                                expect(itemArray).to.have.length(1);
                                expect(itemArray[0].get("firstName")).to.equal("John");
                                expect(itemArray[0].get("lastName")).to.equal("Doe");
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});

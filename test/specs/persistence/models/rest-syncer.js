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

                            server.respondWith("GET", "http://test/person", function(xhr) {
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

                            server.respondWith("GET", "http://test/person", function(xhr) {
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

                        it("should return a rejected Promise if the response is invalid JSON", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            server.respondWith("GET", "http://test/person", function(xhr) {
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

                            server.respondWith("GET", "http://test/person", function(xhr) {
                                xhr.respond(404, null, "");
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

                            server.respondWith("GET", "http://test/person", function(xhr) {
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

                        it("should set the loaded item(s)' sync status to unchanged", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            server.respondWith("GET", "http://test/person", function(xhr) {
                                xhr.respond(200, null, JSON.stringify(
                                    {
                                        first_name: "John",
                                        last_name: "Doe"
                                    }
                                ));
                            });

                            restSyncer.load(Person).then(function(itemArray) {
                                expect(restSyncer.getSyncStatus(itemArray[0])).to.equal(Syncer.STATUS_UNCHANGED);
                                done();
                            });
                        });

                        it("should pass the predicates in the request URL, if there are any specified", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var tmpXhr;

                            server.respondWith("GET", "http://test/person?first_name=John&last_name=Doe",
                                function(xhr) {
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

                            server.respondWith("GET", "http://test/person/1", function(xhr) {
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
                                        id: 1,
                                        first_name: "John",
                                        last_name: "Doe"
                                    }
                                ));
                            });

                            restSyncer.map(Person, Syncer.ACTION_READ, "people/view");

                            restSyncer.load(Person, Predicate.normalize({ id: 1 })).then(function(itemArray) {
                                expect(tmpXhr.url).to.equal("http://test/people/view/1");
                                expect(itemArray).to.have.length(1);
                                expect(itemArray[0].get("firstName")).to.equal("John");
                                expect(itemArray[0].get("lastName")).to.equal("Doe");
                                done();
                            });
                        });

                        it("should use generic mapped URLs if they are available", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var tmpXhr;

                            server.respondWith("GET", "http://test/users", function(xhr) {
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

                        it("should use GET for read operations", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            server.respondWith("GET", "http://test/person/1", function(xhr) {
                                xhr.respond(200, null, JSON.stringify(
                                    {
                                        id: 1,
                                        first_name: "John",
                                        last_name: "Doe"
                                    }
                                ));
                            });

                            restSyncer.load(Person, Predicate.normalize({ id: 1})).then(function(itemArray) {
                                expect(itemArray).to.have.length(1);
                                expect(itemArray[0].get("firstName")).to.equal("John");
                                expect(itemArray[0].get("lastName")).to.equal("Doe");
                                expect(restSyncer.getSyncStatus(itemArray[0])).to.equal(Syncer.STATUS_UNCHANGED);
                                done();
                            });
                        });

                        it("should use GET for list operations", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            server.respondWith("GET", "http://test/person", function(xhr) {
                                xhr.respond(200, null, JSON.stringify([
                                    {
                                        id: 3,
                                        first_name: "John",
                                        last_name: "Doe"
                                    },
                                    {
                                        id: 4,
                                        first_name: "Alan",
                                        last_name: "Poe"
                                    }
                                ]));
                            });

                            restSyncer.load(Person).then(function(itemArray) {
                                expect(itemArray).to.have.length(2);
                                expect(itemArray[0].get("firstName")).to.equal("John");
                                expect(itemArray[0].get("lastName")).to.equal("Doe");
                                expect(restSyncer.getSyncStatus(itemArray[0])).to.equal(Syncer.STATUS_UNCHANGED);
                                expect(itemArray[1].get("firstName")).to.equal("Alan");
                                expect(itemArray[1].get("lastName")).to.equal("Poe");
                                expect(restSyncer.getSyncStatus(itemArray[1])).to.equal(Syncer.STATUS_UNCHANGED);
                                done();
                            });
                        });
                    });

                    describe("instance.save()", function() {
                        it("should return a Promise with the saved item if the save succeeds", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var person = new Person("John", "Doe");
                            restSyncer.setSyncStatus(person, Syncer.STATUS_CREATED);

                            server.respondWith(function(xhr) {
                                xhr.respond(201, null, JSON.stringify(
                                    {
                                        id: 5,
                                        first_name: "John",
                                        last_name: "Doe"
                                    }
                                ));
                            });

                            restSyncer.save(person).then(function() {
                                expect(person.get("id")).to.equal(5);
                                done();
                            });
                        });

                        it("should return a rejected Promise if the response is invalid JSON", function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var person = new Person("John", "Doe");
                            restSyncer.setSyncStatus(person, Syncer.STATUS_CREATED);

                            server.respondWith(function(xhr) {
                                xhr.respond(201, null, "invalid");
                            });

                            restSyncer.save(person).then(
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

                            var person = new Person("John", "Doe");
                            restSyncer.setSyncStatus(person, Syncer.STATUS_CREATED);

                            server.respondWith(function(xhr) {
                                xhr.respond(404, null, "");
                            });

                            restSyncer.save(person).then(
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

                            var person = new Person("John", "Doe");
                            restSyncer.setSyncStatus(person, Syncer.STATUS_CREATED);

                            server.respondWith(function(xhr) {
                                xhr.respond(404, null, "");
                            });

                            restSyncer.save(person).then(
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

                        it("should return a rejected Promise if the specified item's sync status is invalid",
                            function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var person = new Person("John", "Doe");

                            var test = true;

                            server.respondWith(function(xhr) {
                                test = false;
                                xhr.respond(404, null, "");
                            });

                            restSyncer.save(person).then(
                                function() {
                                    done("Should not be here");
                                },
                                function() {
                                    expect(test).to.be.true;
                                    done();
                                }
                            );
                        });

                        it("should set the specified item's sync status to unchanged if the save suceeds",
                            function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var person = new Person("John", "Doe");
                            restSyncer.setSyncStatus(person, Syncer.STATUS_CREATED);

                            server.respondWith(function(xhr) {
                                xhr.respond(201, null, JSON.stringify(
                                    {
                                        id: 5,
                                        first_name: "John",
                                        last_name: "Doe"
                                    }
                                ));
                            });

                            restSyncer.save(person).then(function() {
                                expect(restSyncer.getSyncStatus(person)).to.equal(Syncer.STATUS_UNCHANGED);
                                done();
                            });
                        });

                        it("should use POST for create operations",
                            function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var person = new Person("John", "Doe");
                            restSyncer.setSyncStatus(person, Syncer.STATUS_CREATED);

                            server.respondWith("POST", "http://test/person", function(xhr) {
                                xhr.respond(201, null, JSON.stringify(
                                    {
                                        id: 5,
                                        first_name: "John",
                                        last_name: "Doe"
                                    }
                                ));
                            });

                            restSyncer.save(person).then(function() {
                                expect(restSyncer.getSyncStatus(person)).to.equal(Syncer.STATUS_UNCHANGED);
                                expect(person.get("id")).to.equal(5);
                                done();
                            });
                        });

                        it("should use PUT for update operations",
                            function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var person = new Person("John", "Doe");
                            person.set("id", 5);
                            restSyncer.setSyncStatus(person, Syncer.STATUS_UPDATED);

                            server.respondWith("PUT", "http://test/person/5", function(xhr) {
                                xhr.respond(200, null, JSON.stringify(
                                    {
                                        id: 5,
                                        first_name: "Johnny",
                                        last_name: "Doe"
                                    }
                                ));
                            });

                            restSyncer.save(person).then(function() {
                                expect(restSyncer.getSyncStatus(person)).to.equal(Syncer.STATUS_UNCHANGED);
                                expect(person.get("firstName")).to.equal("Johnny");
                                done();
                            });
                        });

                        it("should use DELETE for delete operations",
                            function(done) {
                            var restSyncer = new RestSyncer("http://test");

                            var person = new Person("John", "Doe");
                            person.set("id", 5);
                            restSyncer.setSyncStatus(person, Syncer.STATUS_DELETED);

                            server.respondWith("DELETE", "http://test/person/5", function(xhr) {
                                xhr.respond(204, null, "");
                            });

                            restSyncer.save(person).then(function() {
                                expect(restSyncer.getSyncStatus(person)).to.equal(Syncer.STATUS_UNCHANGED);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});

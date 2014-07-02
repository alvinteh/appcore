define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("Model", function() {
            it("should be defined", function(done) {
                expect(Am.Model).to.exist;

                done();
            });

            describe("create()", function() {
                it("should create the Id attribute",
                    function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "lastName"], {
                        constructor: function(id) {
                            this.setId(id);
                        }
                    });

                    var person = new Person(1);

                    expect(person.get("id")).to.equal(1);
                    person.set("id", 2);
                    expect(person.get("id")).to.equal(2);

                    done();
                });

                it("should create the model with the specified attributes",
                    function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "lastName"]);

                    var person = new Person("John", "Doe");

                    expect(person.firstName).to.not.exist;
                    expect(person.lastName).to.not.exist;

                    done();
                });

                it("should create models with private attributes (only accessible via get()/set()/getters/setters)",
                    function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "lastName"]);

                    var person = new Person("John", "Doe");

                    expect(person.firstName).to.not.exist;
                    expect(person.lastName).to.not.exist;
                    expect(person.get("firstName")).to.equal("John");
                    expect(person.get("lastName")).to.equal("Doe");

                    done();
                });

                it("should create the getter/setter methods for the specified attributes", function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "lastName"]);

                    var person = new Person();

                    expect(function() { person.setFirstName("John"); }()).to.not.throw;
                    expect(function() { person.setLastName("Doe"); }()).to.not.throw;
                    expect(person.getFirstName()).to.equal("John");
                    expect(person.getLastName()).to.equal("Doe");

                    done();
                });

                it("should create a class constructor if none is provided", function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "lastName"]);

                    var person = new Person("John", "Doe");

                    expect(person.getFirstName()).to.equal("John");
                    expect(person.getLastName()).to.equal("Doe");

                    person.setFirstName("Tom");
                    person.setLastName("Smith");

                    expect(person.getFirstName()).to.equal("Tom");
                    expect(person.getLastName()).to.equal("Smith");

                    done();
                });

                it("should use the provided class constructor if it exists", function(done) {
                    var constructor = function() {
                        this.setFirstName("John");
                        this.setLastName("Doe");
                    };

                    var Person = Am.Model.create("Person", ["firstName", "lastName"], { constructor: constructor });

                    var person = new Person();

                    expect(person.getFirstName()).to.equal("John");
                    expect(person.getLastName()).to.equal("Doe");

                    done();
                });

                it("should implement inheritance in the model if a parent class is specified", function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "lastName"]);

                    var Student = Am.Model.create("Student", ["grade"], {
                        constructor: function(firstName, lastName, grade) {
                            this.set({
                                firstName: firstName,
                                lastName: lastName,
                                grade: grade
                            });
                        },
                        parent: Person
                    });

                    var student = new Student("John", "Doe", 3);
                    expect(student.getFirstName()).to.equal("John");
                    expect(student.getLastName()).to.equal("Doe");
                    expect(student.getGrade()).to.equal(3);

                    var Worker = Am.Model.create("Worker", ["job"], { parent: Person });

                    var worker = new Worker();
                    worker.setFirstName("John");
                    worker.setLastName("Doe");
                    worker.setJob("Doctor");

                    expect(worker.getFirstName()).to.equal("John");
                    expect(worker.getLastName()).to.equal("Doe");
                    expect(worker.getJob()).to.equal("Doctor");

                    done();
                });
            });

            describe("instance.getModelName()", function() {
                it("should return the model name", function(done) {
                    var Person = Am.Model.create("Person", []);

                    expect(Person.getModelName()).to.equal("Person");

                    done();
                });
            });

            describe("instance.addMethod()", function() {
                it("should create a public method", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addMethod("test", function() {
                        return true;
                    });

                    var person = new Person();

                    expect(person.test()).to.be.true;

                    done();
                });

                it("should create a non-static method", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addMethod("test", function() {
                        return true;
                    });

                    expect(Person.prototype.test).to.exist;

                    done();
                });

            });

            describe("instance.hasMethod()", function() {
                it("should detect whether the specified non-static method exists", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addMethod("test", function() {
                        return true;
                    });

                    expect(Person.hasMethod("test")).to.be.true;
                    expect(Person.hasMethod("fakeMethod")).to.be.false;

                    done();
                });
            });

            describe("instance.removeMethod()", function() {
                it("should remove the specified non-static method from itself", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addMethod("test", function() {
                        return true;
                    });

                    var person1 = new Person();

                    Person.removeMethod("test");

                    var person2 = new Person();

                    expect(person1.test).to.not.exist;
                    expect(person2.test).to.not.exist;

                    done();
                });
            });

            describe("instance.addStaticMethod()", function() {
                it("should create a public method", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addStaticMethod("test", function() {
                        return true;
                    });

                    expect(Person.test()).to.be.true;

                    done();
                });

                it("should create a static method", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addStaticMethod("test", function() {
                        return true;
                    });

                    expect(Person.test).to.exist;
                    expect(Person.prototype.test).to.not.exist;

                    done();
                });

            });

            describe("instance.hasStaticMethod()", function() {
                it("should detect whether the specified static method exists", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addStaticMethod("test", function() {
                        return true;
                    });

                    expect(Person.hasStaticMethod("test")).to.be.true;
                    expect(Person.hasStaticMethod("fakeMethod")).to.be.false;

                    done();
                });

                it("should not confuse between static methods and static attributes", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addStaticAttribute("test", true);

                    expect(Person.hasStaticMethod("test")).to.be.false;

                    done();
                });
            });

            describe("instance.removeStaticMethod()", function() {
                it("should remove the specified static method from itself", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addStaticMethod("test", function() {
                        return true;
                    });

                    Person.removeStaticMethod("test");

                    expect(Person.test).to.not.exist;

                    done();
                });
            });

            describe("instance.addStaticAttribute()", function() {
                it("should create a public attribute", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addStaticAttribute("test", 5);

                    expect(Person.test).to.equal(5);
                    expect(Person.prototype.test).to.not.exist;

                    done();
                });

                it("should create a static attribute", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addStaticAttribute("test", 5);

                    var person1 = new Person();
                    var person2 = new Person();

                    expect(Person.test).to.exist;
                    expect(Person.prototype.test).to.not.exist;
                    expect(person1.test).to.not.exist;
                    expect(person2.test).to.not.exist;

                    done();
                });

            });

            describe("instance.hasStaticAttribute()", function() {
                it("should detect whether the specified static attribute exists", function(done) {
                    var Person = Am.Model.create("Person", ["firstName"]);
                    Person.addStaticAttribute("test", 5);

                    expect(Person.hasStaticAttribute("test")).to.be.true;
                    expect(Person.hasStaticAttribute("fakeAttribute")).to.be.false;

                    done();
                });


                it("should not confuse between static methods and static attributes", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addStaticMethod("test", function() {
                        return true;
                    });

                    expect(Person.hasStaticAttribute("test")).to.be.false;

                    done();
                });
            });

            describe("instance.removeStaticMethod()", function() {
                it("should remove the specified static attribute from itself", function(done) {
                    var Person = Am.Model.create("Person", []);
                    Person.addStaticAttribute("test", 5);

                    Person.removeStaticAttribute("test");

                    expect(Person.test).to.not.exist;

                    done();
                });
            });

            describe("instance.getValidationRules()", function() {
                it("should return the model's validation rules", function(done) {
                    var Person = Am.Model.create("Person", ["firstName"]);

                    var validationRules = { firstName: [ { required: true } ] };
                    Person.setValidationRules(validationRules);

                    expect(Person.getValidationRules()).to.equal(validationRules);

                    done();
                });
            });

            describe("instance.setValidationRules()", function() {
                it("should set the model's validation rules", function(done) {
                    var Person = Am.Model.create("Person", ["firstName"]);

                    var validationRules = { firstName: [ { required: true } ] };
                    Person.setValidationRules(validationRules);

                    expect(Person.getValidationRules()).to.equal(validationRules);

                    done();
                });
            });

            describe("modelInstance.getModel()", function() {
                it("should return the caller's model", function(done) {
                    var Person = Am.Model.create("Person", []);

                    var person = new Person();

                    expect(person.getModel()).to.equal(Person);

                    done();
                });
            });

            describe("modelInstance.get()", function() {
                it("should return the value of specified attribute", function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "lastName"]);

                    var person = new Person("John", "Doe");

                    expect(person.get("firstName")).to.equal("John");
                    expect(person.get("lastName")).to.equal("Doe");

                    done();
                });
            });

            describe("modelInstance.set()", function() {
                it("should set the value of specified attribute", function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "lastName"]);

                    var person = new Person("John", "Doe");

                    person.set("firstName", "Tom");
                    person.set("lastName", "Smith");

                    expect(person.get("firstName")).to.equal("Tom");
                    expect(person.get("lastName")).to.equal("Smith");

                    done();
                });
            });

            describe("modelInstance.has()", function() {
                it("should check whether the specified attribute exists", function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "lastName"]);

                    var person = new Person("John", "Doe");

                    expect(person.has("firstName")).to.be.true;
                    expect(person.has("fullName")).to.be.false;

                    done();
                });
            });

            describe("modelInstance.getId()", function() {
                it("should return the caller's Id", function(done) {
                    var Person = Am.Model.create("Person", [], {
                        constructor: function(id) {
                            this.set("id", 1);
                        }
                    });

                    var person = new Person(1);

                    expect(person.getId()).to.equal(1);

                    done();
                });
            });

            describe("modelInstance.setId()", function() {
                it("should set the caller's Id", function(done) {
                    var Person = Am.Model.create("Person", [], {
                        constructor: function(id) {
                            this.set("id", 1);
                        }
                    });

                    var person = new Person(1);
                    person.setId(2);

                    expect(person.getId()).to.equal(2);

                    done();
                });
            });

            describe("modelInstance.toObject()", function() {
                it("should return an object representation of the caller", function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "lastName"]);

                    var person = new Person("John", "Doe");
                    person.setId(1);

                    var personObject = person.toObject();

                    expect(personObject.id).to.equal(1);
                    expect(personObject.firstName).to.equal("John");
                    expect(personObject.lastName).to.equal("Doe");

                    done();
                });

                it("should also return attributes from parent classes", function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "lastName"]);
                    var Worker = Am.Model.create("Worker", ["job"], {
                        parent: Person,
                        constructor: function(id, firstName, lastName, job) {
                            this.set({
                               id: id,
                                firstName: firstName,
                                lastName: lastName,
                                job: job
                            });
                        }
                    });
                    var Soldier = Am.Model.create("Soldier", ["rank"], {
                        parent: Worker,
                        constructor: function(id, firstName, lastName, rank) {
                            this.set({
                               id: id,
                                firstName: firstName,
                                lastName: lastName,
                                job: "Soldier",
                                rank: rank
                            });
                        }
                    });

                    var worker = new Worker(1, "John", "Doe", "Doctor");
                    var workerObject = worker.toObject();

                    expect(workerObject.id).to.equal(1);
                    expect(workerObject.firstName).to.equal("John");
                    expect(workerObject.lastName).to.equal("Doe");
                    expect(workerObject.job).to.equal("Doctor");

                    var soldier = new Soldier(1, "John", "Doe", "Corporal");
                    var soldierObject = soldier.toObject();

                    expect(soldierObject.id).to.equal(1);
                    expect(soldierObject.firstName).to.equal("John");
                    expect(soldierObject.lastName).to.equal("Doe");
                    expect(soldierObject.job).to.equal("Soldier");
                    expect(soldierObject.rank).to.equal("Corporal");

                    done();
               });
            });

            describe("modelInstance.validate()", function() {
                it("should process required rules", function(done) {
                    var Person = Am.Model.create("Person", ["firstName"]);

                    Person.setValidationRules({
                        firstName: [
                            {
                                required: true
                            }
                        ]
                    });

                    var person1 = new Person();
                    person1.setFirstName("John");
                    expect(person1.validate()).to.be.true;

                    var person2 = new Person();
                    expect(person2.validate()).to.be.an("object");

                    done();
                });

                it("should process type rules", function(done) {
                    var Person = Am.Model.create("Person", ["firstName", "age", "height", "working"]);

                    var validationRules = {
                        firstName: [
                            {
                                type: "string"
                            }
                        ],
                        age: [
                            {
                                type: "int"
                            }
                        ],
                        height: [
                            {
                                type: "number"
                            }
                        ],
                        working: [
                            {
                                type: "boolean"
                            }
                        ]
                    };

                    Person.setValidationRules(validationRules);

                    var person1 = new Person("John", 18, 175.5, true);
                    expect(person1.validate()).to.be.true;

                    var person2 = new Person(16, "invalid", "invalid", "invalid");
                    expect(person2.validate()).to.be.an("object");

                    var person3 = new Person(null, null, null, null);
                    expect(person3.validate()).to.be.true;

                    for (var attribute in validationRules) {
                        validationRules[attribute].push({ required : true });
                    }

                    expect(person3.validate()).to.be.an("object");

                    done();
                });

                it("should process minLength rules", function(done) {
                    var Person = Am.Model.create("Person", ["firstName"]);

                    var validationRules = {
                        firstName: [
                            {
                                minLength: 2
                            }
                        ]
                    };

                    Person.setValidationRules(validationRules);

                    var person1 = new Person("John");
                    expect(person1.validate()).to.be.true;

                    var person2 = new Person("J");
                    expect(person2.validate()).to.be.an("object");

                    var person3 = new Person(123);
                    expect(person3.validate()).to.be.an("object");

                    var person4 = new Person(null);
                    expect(person4.validate()).to.be.an("object");

                    for (var attribute in validationRules) {
                        validationRules[attribute].push({ required : true });
                    }

                    expect(person4.validate()).to.be.an("object");

                    done();
                });

                it("should process maxLength rules", function(done) {
                    var Person = Am.Model.create("Person", ["firstName"]);

                    var validationRules = {
                        firstName: [
                            {
                                maxLength: 4
                            }
                        ]
                    };

                    Person.setValidationRules(validationRules);

                    var person1 = new Person("John");
                    expect(person1.validate()).to.be.true;

                    var person2 = new Person("Johnny");
                    expect(person2.validate()).to.be.an("object");

                    var person3 = new Person(123);
                    expect(person3.validate()).to.be.an("object");

                    var person4 = new Person(null);
                    expect(person4.validate()).to.be.an("object");

                    for (var attribute in validationRules) {
                        validationRules[attribute].push({ required : true });
                    }

                    expect(person4.validate()).to.be.an("object");

                    done();
                });

                it("should process minValue rules", function(done) {
                    var Person = Am.Model.create("Person", ["height"]);

                    var validationRules = {
                        height: [
                            {
                                minValue: 30
                            }
                        ]
                    };

                    Person.setValidationRules(validationRules);

                    var person1 = new Person(180);
                    expect(person1.validate()).to.be.true;

                    var person2 = new Person(29);
                    expect(person2.validate()).to.be.an("object");

                    var person3 = new Person("invalid");
                    expect(person3.validate()).to.be.an("object");

                    var person4 = new Person(null);
                    expect(person4.validate()).to.be.an("object");

                    for (var attribute in validationRules) {
                        validationRules[attribute].push({ required : true });
                    }

                    expect(person4.validate()).to.be.an("object");

                    done();
                });

                it("should process maxValue rules", function(done) {
                    var Person = Am.Model.create("Person", ["height"]);

                    var validationRules = {
                        height: [
                            {
                                maxValue: 250
                            }
                        ]
                    };

                    Person.setValidationRules(validationRules);

                    var person1 = new Person(180);
                    expect(person1.validate()).to.be.true;

                    var person2 = new Person(290);
                    expect(person2.validate()).to.be.an("object");

                    var person3 = new Person("invalid");
                    expect(person3.validate()).to.be.an("object");

                    var person4 = new Person(null);
                    expect(person4.validate()).to.be.an("object");

                    for (var attribute in validationRules) {
                        validationRules[attribute].push({ required : true });
                    }

                    expect(person4.validate()).to.be.an("object");

                    done();
                });

                it("should process format rules", function(done) {
                    var Person = Am.Model.create("Person", ["username", "email", "firstName", "creditCard", "status"]);

                    var validationRules = {
                        username: [
                            {
                                format: "alphanumeric"
                            }
                        ],
                        email: [
                            {
                                format: "email"
                            }
                        ],
                        firstName: [
                            {
                                format: "alpha"
                            }
                        ],
                        creditCard: [
                            {
                                format: "creditcard"
                            }
                        ],
                        status: [
                            {
                                format: "flag"
                            }
                        ]
                    };

                    Person.setValidationRules(validationRules);

                    var person1 = new Person("john123", "john.doe@email.com", "John", "4111111111111111", 1);
                    expect(person1.validate()).to.be.true;

                    var person2 = new Person("invalid ", "invalid", 123, "invalid");
                    expect(person2.validate()).to.be.an("object");

                    var person3 = new Person(null, null, null, null, null);
                    expect(person3.validate()).to.be.an("object");

                    for (var attribute in validationRules) {
                        validationRules[attribute].push({ required : true });
                    }

                    expect(person3.validate()).to.be.an("object");

                    done();
                });

                it("should process regex rules", function(done) {
                    var Person = Am.Model.create("Person", ["firstName"]);

                    var validationRules = {
                        firstName: [
                            {
                                regex: /^[a-z]{2,}$/i
                            }
                        ]
                    };

                    Person.setValidationRules(validationRules);

                    var person1 = new Person("John");
                    expect(person1.validate()).to.be.true;

                    var person2 = new Person("John129");
                    expect(person2.validate()).to.be.an("object");

                    var person3 = new Person(122);
                    expect(person3.validate()).to.be.an("object");

                    var person4 = new Person(null);
                    expect(person4.validate()).to.be.an("object");

                    for (var attribute in validationRules) {
                        validationRules[attribute].push({ required : true });
                    }

                    expect(person4.validate()).to.be.an("object");

                    done();
                });

                it("should process function rules", function(done) {
                    var Person = Am.Model.create("Person", ["firstName"]);

                    var validationRules = {
                        firstName: [
                            {
                                function: function(value) {
                                    if (typeof value !== "undefined" && value !== null && value[0] === "J") {
                                        return true;
                                    }
                                    else {
                                        return "The first name should start with \"J\".";
                                    }
                                }
                            }
                        ]
                    };

                    Person.setValidationRules(validationRules);

                    var person1 = new Person("John");
                    expect(person1.validate()).to.be.true;

                    var person2 = new Person("Tom");
                    expect(person2.validate()).to.be.an("object");

                    var person3 = new Person(122);
                    expect(person3.validate()).to.be.an("object");

                    var person4 = new Person(null);
                    expect(person4.validate()).to.be.an("object");

                    for (var attribute in validationRules) {
                        validationRules[attribute].push({ required : true });
                    }

                    expect(person4.validate()).to.be.an("object");

                    var Car = Am.Model.create("Car", ["type", "fuelType"]);

                    Car.setValidationRules({
                        fuelType: [
                            {
                                function: function(fuelType, car) {
                                    if (car.getType() === "electric" && fuelType !== null) {
                                        return "All-electric cars should not use any fuel.";
                                    }
                                    else if (car.getType() !== "electric" && fuelType === null) {
                                        return "Fuel type is required for non-electric cars.";
                                    }
                                    else {
                                        return true;
                                    }
                                }
                            }
                        ]
                    });

                    var car1 = new Car("electric", null);
                    expect(car1.validate()).to.be.true;

                    var car2 = new Car("electric", "diesel");
                    expect(car2.validate()).to.be.an("object");

                    var car3 = new Car("hybrid", "petrol");
                    expect(car3.validate()).to.be.true;

                    var car4 = new Car("hybrid", null);
                    expect(car4.validate()).to.be.an("object");

                    done();
                });

                it("should process rule chains (involving required and other rules) for empty values", function(done) {
                    var Person = Am.Model.create("Person", ["firstName"]);

                    Person.setValidationRules({
                        firstName: [
                            {
                                required: true
                            },
                            {
                                format: "alpha",
                                message: "The person's first name should only contain alphabets."
                            },
                            {
                                minLength: 2,
                            }
                        ]
                    });

                    var person1 = new Person("John");
                    expect(person1.validate()).to.be.true;

                    var person2 = new Person(null);
                    expect(person2.validate()).to.be.an("object");

                    done();
                });
            });

            describe("modelInstance.isValid()", function() {
                it("should return whether the caller passes the model's validation rules", function(done) {
                    var Person = Am.Model.create("Person", ["firstName"]);

                    var validationRules = { firstName: [ { required: true } ] };
                    Person.setValidationRules(validationRules);

                    var person = new Person("John");

                    expect(person.isValid()).to.be.true;

                    person.setFirstName(null);

                    expect(person.isValid()).to.be.false;


                    done();
                });
            });

        });
    });
});

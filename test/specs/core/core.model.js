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

        });
    });
});

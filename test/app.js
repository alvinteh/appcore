require.config({
    urlArgs: (new Date()).getTime().toString().substring(8),
    paths: {
        "appcore": "dependencies/appcore",
        "jquery": "dependencies/jquery/jquery"
    }
});

require([
        "appcore/appcore",
        "appcore/core/modules/util/models/promise",
        "appcore/core/modules/core/helpers/event-helper",
        "appcore/core/modules/util/helpers/uuid-helper"
    ],
    function(Ac, Promise, EventHelper) {

    var testFlags = {
        models: {
            base: true
        },
        general: {
            dataBinding: true,
            events: false,
            helpers: false,
            promises: false
        }
    };

    var test = function(module, func) {
        var flags = module.split(".");

        if (testFlags[flags[0]][flags[1]]) {
            func();
        }
    };

    /*
     * COMMON TEST VARIABLES
     */
    var Guest;

    /*
     *  MODELS - BASE
     */
     test("models.base", function() {
        //Model definition
        Guest = Ac.Model.create("Guest", ["name", "category", "confirmed"]);

        //Model method definition
        Guest.addMethod("confirm", function() {
            this.set("confirmed", 1);
        });

        //Model static attribute definition
        Guest.addStaticAttribute("CATEGORY_NORMAL", 0);
        Guest.addStaticAttribute("CATEGORY_VIP", 1);

        //Model static method definition
        Guest.addStaticMethod("test", function() {
            console.log("Testing the Guest model.");
        });

        //Model validation
        Guest.setValidationRules({
            name: [
                {
                    required: true
                },
                {
                    type: "string"
                },
                {
                    minLength: 2,
                    message: "The guest's name should be at least 2 characters long."
                }
            ],
            category: [
                {
                    type: "int"
                }
            ],
            confirmed: [
                {
                    type: "int"
                },
                {
                    format: "flag"
                }
            ]
        });

        Guest.test();
    });

    /*
     *  GENERAL - HELPERS
     */

    test("general.helpers", function() {
        console.log(Ac.Helper.get("Uuid").generateUuid());
    });

    /*
     * GENERAL - DATA BINDING
     */
    test("general.dataBinding", function() {
        var guestA = new Guest("Alan", 1, 0);

        //Define view
        var view1 = Ac.View.create("#sample");
        var nameElement = Ac.View.Element.create("#sample-name", view1);
        var categoryElement = Ac.View.Element.create("#sample-category", view1);
        var confirmedElement = Ac.View.Element.create("#sample-status", view1);

        //Data binding creation
        nameElement.addDataBinding(guestA, "name");
        categoryElement.addDataBinding(guestA, function() {
            switch (guestA.getCategory()) {
                case Guest.CATEGORY_NORMAL:
                    return "Normal";
                case Guest.CATEGORY_VIP:
                    return "VIP";
            }
        });
        confirmedElement.addDataBinding(guestA, function() {
            return (guestA.getConfirmed() ? "checked" : "");
        }, "checked");
    });

    /*
     * GENERAL - EVENTS
     */
     test("general.events", function() {
        var guestA = new Guest("Alan", 1, 0);
        var guestB = new Guest("Bob", 1, 0);

        //Event triggers
        Guest.addMethod("talk", function(message) {
            this.trigger("talk", { message: message });
        });

        //Event observers
        EventHelper.observe(guestA, "talk", function(event) {
            console.log(event.getTarget().getName() + " has said \"" + event.getData().message + "\".");
        });

        EventHelper.observe(guestB, "talk", function(event) {
            console.log(event.getTarget().getName() + " has said \"" + event.getData().message + "\".");
        });

        //Test usage
        guestA.talk("Hello!");
        guestB.talk("Hi!");
        guestA.talk("How are you?");
    });

    /*
     *  GENERAL - PROMISES
     */
    test("general.promises", function() {
        //Promise creation (method #1)
        var testX = Promise.convert(function(callback, error, value) {
            setTimeout(function() {
                value = 10;
                console.log("Initial value = " + value);
                callback(value);
            }, 0);
        });

        //Promise creation (method #2)
        function testY1(value) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    value += 1;
                    console.log("value + 1 = " + value);
                    resolve(value);
                }, 25);
            });
        }

        function testY2(value) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    value += 2;
                    console.log("value + 2 = " + value);
                    resolve(value);
                }, 50);
            });
        }

        function testY3(value) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    value += 3;
                    console.log("value + 3 = " + value);
                    resolve(value);
                }, 75);
            });
        }

        //Test usage
        testX()
        .then(testY1)
        .then(testY2)
        .then(testY3)
        .then(function(value) {
            console.log("Final value = " + value);
        });
    });
});

/*
require(["appcore/app"], function(App) {
    //Define models
    var User = App.Model.create(
        {
            name: "string",
            email: "email",
            tasks: Collection
        },
        function(name, email) {
            this.set({
                name: name,
                email: email
            });
        }
    );

    User.addMethod("hasTasks", function() {
        return this.tasks.hasItems();
    });

    var Task = App.Model.create({
        description: "string",
        status: "boolean"
    });

    //Define controllers
    var UsersController = App.Controller.create(User);

    UsersController.addAction("index", function() {
        var people = this.getCollectionItems();

        var view = App.View.create("#content", template);
        view.bind(people);
    });

    UsersController.addAction("create", function() {
        this.observe("#submit", "click", function() {
            var user = new User(document.querySelector("#input-name").value, document.querySelector("#input-email").value);

            if (user.isValid()) {
                this.getCollection().add(user);
                this.persistCollection(function(response) {
                    if (response.status === 1) {
                        App.go("/");
                    }
                    else {
                        document.querySelector("#notice").innerHTML = "Error: A problem was encountered while saving the record."
                    }
                });
            }
        });
    });

    UsersController.addAction("view", function(id) {
        var user = this.getCollection().find(id);

        var view = App.View.create("#content", template);
        view.render(user);
    });

    UsersController.addAction("update", function() {
        var user = this.getCollection().find(id);

        this.observe("#submit", "click", function() {
            user.setName(document.querySelector("#input-name").value);
            user.setEmail(document.querySelector("#input-email").value);

            if (user.isValid()) {
                this.getCollection().add(user);
                this.persistCollection(function(response) {
                    if (response.status === 1) {
                        App.go("/");
                    }
                    else {
                        document.querySelector("#notice").innerHTML = "Error: A problem was encountered while saving the record."
                    }
                });
            }
        });
    });

    UsersController.addAction("delete", function(id) {
        this.getCollection().delete(id);
        this.persistCollection(function(response) {
            if (response.status === 1) {
                App.go("/");
            }
            else {
                document.querySelector("#notice").innerHTML = "Error: A problem was encountered while saving the record."
            }
        });
    });

    UsersController.addAction

    App.setBaseUrl("http://localhost/alvinteh_appcore/test");
    App.Route.add("/", UsersController.getActions());

    view1.addDataBinding(p1, function() { return p1.getName() + "!!!"; }, "value");
    view2.addDataBinding(p1, "name", "innerHTML");
});
*/
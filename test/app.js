require.config({
    urlArgs: (new Date()).getTime().toString().substring(8),
    paths: {
        "appcore": "dependencies/appcore",
        "jquery": "dependencies/jquery/jquery"
    }
});

require([
        "appcore/appcore",
        "appcore/core/modules/core/models/promise",
        "appcore/core/modules/core/helpers/event-helper"
    ],
    function(Ac, Promise, EventHelper) {

    var testFlags = {
        models: {
            base: true,
            validation: true
        },
        general: {
            dataBinding: true,
            events: false,
            modules: true,
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

        Guest.test();
    });

    /*
     * MODELS - VALIDATION
     */
    test("models.validation", function() {
        //Model validation rules
        Guest.setValidationRules({
            name: [
                {
                    required: true
                },
                {
                    format: "alpha",
                    message: "The guest's name should only contain alphabets."
                },
                {
                    minLength: 2,
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

        var guestA = new Guest("", Guest.CATEGORY_NORMAL, 1);

        var view1 = Ac.View.create("#form");
        Ac.View.Element.create("#form-name", view1).addDataBinding(guestA, "name");
        var options = document.querySelector("#form-category").options;
        Ac.View.Element.create("#form-category", view1).addDataBinding(guestA, "category", {
            elementProperties: null,
            forwardTransform: function(value) {
                var option;

                for (var i = 0, length = options.length; i < length; i++) {
                    option = options[i];

                    if (option.value.toString() === value.toString()) {
                        options[i].selected = true;
                        break;
                    }
                }
            },
            backwardTransform: function(value) {
                console.log("Not here");
                return options[document.querySelector("#form-category").selectedIndex].value;
            }
        });
        Ac.View.Element.create("#form-confirmed", view1).addDataBinding(guestA, "confirmed", {
            elementProperties: "checked",
            forwardTransform: function(value) {
                return (value === 1 ? "checked" : "");
            },
            backwardTransform: function(value) {
                return (this.checked ? 1 : 0);
            }
        });

        EventHelper.observe(guestA, "change", function() {
            var validationInfo = guestA.validate();

            var existingErrors = document.querySelectorAll(".input-error");

            for (var i = 0, length = existingErrors.length; i < length; i++) {
                existingErrors[i].remove();
            }

            if (validationInfo !== true) {
                for (var property in validationInfo) {
                    var inputElement = document.querySelector("#form-" + property);
                    var errorElement = document.createElement("span");
                    errorElement.className = "input-error";
                    errorElement.innerHTML = validationInfo[property].join("<br />");

                    inputElement.parentNode.appendChild(errorElement);
                }
            }
        });
    });

    /*
     *  GENERAL - HELPERS
     */

    test("general.modules", function() {
        Ac.Module.load("Util").then(function() {
            console.log(Ac.Module.get("Util").UuidHelper.generateUuid());
        });
    });

    /*
     * GENERAL - DATA BINDING
     */
    test("general.dataBinding", function() {
        var guestA = new Guest("Alan", 1, 1);

        //Define view
        var view1 = Ac.View.create("#sample");

        //Data binding creation
        Ac.View.Element.create("#sample-name", view1).addDataBinding(guestA, "name");
        Ac.View.Element.create("#sample-category", view1).addDataBinding(guestA, "category", {
            forwardTransform: function(value) {
                switch (value) {
                    case Guest.CATEGORY_NORMAL:
                        return "Normal";
                    case Guest.CATEGORY_VIP:
                        return "VIP";
                }
            }
        });
        Ac.View.Element.create("#sample-confirmed", view1).addDataBinding(guestA, "confirmed", {
            elementProperties: "checked",
            forwardTransform: function(value) {
                return (value === 1 ? "checked" : "");
            }
        });
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
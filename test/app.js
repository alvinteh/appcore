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
        "appcore/core/modules/events/helpers/event-helper",
        "appcore/core/modules/util/helpers/uuid-helper"
    ],
    function(Ac, Promise, EventHelper) {

    /*
     *  PROMISES
     */

    /*
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
                alert("value + 1 = " + value);
                resolve(value);
            }, 25);
        });
    }

    function testY2(value) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                value += 2;
                alert("value + 2 = " + value);
                resolve(value);
            }, 50);
        });
    }

    function testY3(value) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                value += 3;
                alert("value + 3 = " + value);
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
        alert("Final value = " + value);
    });

    /*
     *  HELPERS
     */

    /*
    //Test usage
    console.log(Ac.Helper.get("Uuid").generateUuid());

    /*
     *  MODELS
     */

    //Model definition
    var User = Ac.Model.create(["name", "age"], function(name, age) {
        this.set({
            name: name,
            age: age
        });
    });

    //Model method definition
    User.addMethod("greet", function() {
        console.log("Hello, I am " + this.getName() + " and I am " + this.getAge() + "!");
    });

    //Model static method definition
    User.addStaticMethod("test", function() {
        console.log("Testing the User class");
    });

    //Test usage
    var userA = new User("Alan", 12);
    var userB = new User("Bob", 15);

    /*
    userA.greet();
    userB.greet();
    userA.set("name", "Adrian");
    userB.set({ name: "Bill" });
    userA.greet();
    userB.greet();
    User.test();
    */

    /*
     * EVENTS
     */

    /*
    //Event triggers
    User.addMethod("grow", function() {
        this.set("age", this.get("age") + 1);
        this.trigger("grow", { age: this.get("age") });
    });

    User.addMethod("talk", function(message) {
        this.trigger("talk", { message: message });
    });

    //Event observers
    EventHelper.observe(userA, "grow", function(event) {
        console.log(event.getTarget().getName() + " has grown to " + event.getTarget().getAge() + " years old.");
    });

    EventHelper.observe(userA, "talk", function(event) {
        console.log(event.getTarget().getName() + " has said \"" + event.getData().message + "\".");
    });

    EventHelper.observe(userB, "grow", function(event) {
        console.log(event.getTarget().getName() + " has grown to " + event.getTarget().getAge() + " years old.");
    });

    //Test usage
    userA.grow();
    userA.grow();
    userA.grow();
    userB.grow();
    userB.grow();
    userA.talk("Sup bro?");

    /*
     * DATA BINDING
     */

    /*
    //Define view
    var view1 = Ac.View.create("#input-text");
    var view2 = Ac.View.create("#header-title, #footer");

    //Data binding creation
    view1.addDataBinding(userA, function() { return userA.getName() + "!!!"; }, "value");
    view2.addDataBinding(userA, "name", "innerHTML");

    //Test usage
    userA.setName("Aaron");
    */
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
require.config({
    urlArgs: (new Date()).getTime().toString().substring(8),
    paths: {
        "appcore": "dependencies/appcore",
        "jquery": "dependencies/jquery/jquery"
    }
});

require(["appcore/appcore"], function(Ac) {
    //Define User class
    var User = Ac.Model.create(["name", "age"], function(name) {
        this.set("name", name);
        this.set("age", 10);
    });

    User.prototype.greet = function() {
        console.log("Hello, I am " + this.getName() + " and I am " + this.getAge() + "!");
    };

    //Define view
    var view1 = Ac.View.create("#input-text");
    var view2 = Ac.View.create("#header-title, #footer");

    //Test user class
    var p1 = new User("Alan");
    p1.greet();

    view1.addDataBinding(p1, function() { return p1.getName() + "!!!"; }, "value");
    view2.addDataBinding(p1, "name", "innerHTML");
    p1.setName("Bob");
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

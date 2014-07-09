define(function() {
    var Am = window.Am;

    describe("Am", function() {
        describe("View", function() {
            afterEach(function() {
                $("#test").html("");
            });

            describe("Element", function() {
                describe("instance.getElement()", function() {
                    it("should return the appropriate HTMLElement", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var element = Am.View.Element.create("#test1");

                        expect(element.getElement()).to.equal($("#test1")[0]);

                        done();
                    });

                    it("should return the first HTMLElement if there are multiple HTMLElements", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test").append("<div id=\"test2\">");
                        var element = Am.View.Element.create("#test1");

                        expect(element.getElement()).to.equal($("#test1")[0]);

                        done();
                    });
                });

                describe("instance.getElements()", function() {
                    it("should return an array of all the HTMLElements", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test").append("<div id=\"test2\">");
                        var element = Am.View.Element.create("#test1, #test2");
                        var htmlElements = element.getElements();

                        expect(htmlElements[0]).to.equal($("#test1")[0]);
                        expect(htmlElements[1]).to.equal($("#test2")[0]);

                        done();
                    });

                    it("should return sole HTMLElements in an array", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var element = Am.View.Element.create("#test1");
                        var htmlElements = element.getElements();

                        expect(htmlElements[0]).to.equal($("#test1")[0]);

                        done();
                    });
                });

                describe("addDataBinding()", function() {
                    it("should automatically call refresh() for non-reverse bindings", function(done) {
                        $("#test").append("<input id=\"test1\" type=\"text\">");
                        $("#test").append("<input id=\"test2\" type=\"text\">");
                        $("#test").append("<input id=\"test3\" type=\"text\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element1 = Am.View.Element.create("#test1");
                        var element2 = Am.View.Element.create("#test2");
                        var element3 = Am.View.Element.create("#test3");

                        element1.addDataBinding(person, "name", { direction: Am.View.Element.ONE_WAY_BINDING });
                        element2.addDataBinding(person, "name", { direction: Am.View.Element.REVERSE_BINDING });
                        element3.addDataBinding(person, "name", { direction: Am.View.Element.TWO_WAY_BINDING });

                        expect($("#test1").val()).to.equal("Alan");
                        expect($("#test2").val()).to.equal("");
                        expect($("#test3").val()).to.equal("Alan");

                        done();
                    });

                    it("should bind the Element's HTMLElement(s)'s innerHTML to the instance by default for " +
                        "non-input HTML elements", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test").append("<div id=\"test2\">");
                        $("#test").append("<div id=\"test3\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element1 = Am.View.Element.create("#test1");
                        var element2 = Am.View.Element.create("#test2, #test3");

                        element1.addDataBinding(person, "name");
                        element2.addDataBinding(person, "name");

                        expect($("#test1").html()).to.equal("Alan");
                        expect($("#test2").html()).to.equal("Alan");
                        expect($("#test3").html()).to.equal("Alan");

                        done();
                    });

                    it("should bind the Element's HTMLElement(s)'s value to the instance by default for input HTML " +
                        "elements", function(done) {
                        $("#test").append("<input id=\"test1\" type=\"text\">");
                        $("#test").append("<input id=\"test2\" type=\"text\">");
                        $("#test").append("<input id=\"test3\" type=\"text\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element1 = Am.View.Element.create("#test1");
                        var element2 = Am.View.Element.create("#test2, #test3");

                        element1.addDataBinding(person, "name");
                        element2.addDataBinding(person, "name");

                        expect($("#test1").val()).to.equal("Alan");
                        expect($("#test2").val()).to.equal("Alan");
                        expect($("#test3").val()).to.equal("Alan");

                        done();
                    });

                    it("should bind the instance to the Element's HTMLElement(s)' characterData by default for " +
                        "non-input HTML  elements", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test").append("<div id=\"test2\">");
                        $("#test").append("<div id=\"test3\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element1 = Am.View.Element.create("#test1");
                        var element2 = Am.View.Element.create("#test2, #test3");

                        element1.addDataBinding(person, "name");
                        element2.addDataBinding(person, "name");
                        $("#test1").html("John");

                        window.setTimeout(function() {
                            expect(person.get("name")).to.equal("John");

                            //element2.refresh();

                            //expect($("#test2").html()).to.equal("John");
                            //expect($("#test3").html()).to.equal("John");

                            done();
                        }, 0);
                    });

                    it("should bind the instance to the Element's HTMLElement(s)' value by default for input " +
                        "HTML  elements", function(done) {
                        $("#test").append("<input id=\"test1\" type=\"text\">");
                        $("#test").append("<input id=\"test2\" type=\"text\">");
                        $("#test").append("<input id=\"test3\" type=\"text\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element1 = Am.View.Element.create("#test1");
                        var element2 = Am.View.Element.create("#test2, #test3");

                        element1.addDataBinding(person, "name");
                        element2.addDataBinding(person, "name");
                        $("#test1").val("John");

                        //Manually trigger change event
                        var event = document.createEvent("HTMLEvents");
                        event.initEvent("change", true, true);
                        $("#test1")[0].dispatchEvent(event);

                        window.setTimeout(function() {
                            expect(person.get("name")).to.equal("John");

                            //element2.refresh();

                            //expect($("#test2").html()).to.equal("John");
                            //expect($("#test3").html()).to.equal("John");

                            done();
                        }, 0);
                    });

                    it("should respect the backward transform option on characterData if it is specified",
                        function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element = Am.View.Element.create("#test1");

                        element.addDataBinding(person, "name", {
                            backwardTransform: function(value) { return value.toLowerCase(); }
                        });
                        $("#test1").html("John");

                        window.setTimeout(function() {
                            expect(person.get("name")).to.equal("john");
                            done();
                        }, 50);
                    });

                    it("should respect the backward transform option on attributes if it is specified",
                        function(done) {
                        var assertionCount = 2;
                        var completedCount = 0;
                        var notify = function() {
                            if (++completedCount === assertionCount) {
                                done();
                            }
                        };

                        $("#test").append("<div id=\"test1\">");
                        var Color = Am.Model.create("Color", ["name"]);
                        var color = new Color("Red");
                        var element1 = Am.View.Element.create("#test1");

                        element1.addDataBinding(color, "name", {
                            elementProperties: ["data-color"],
                            backwardTransform: function(value) { return value.toString().toLowerCase(); }
                        });
                        $("#test1")[0].dataset.color = "Blue";

                        window.setTimeout(function() {
                            expect(color.get("name")).to.equal("blue");
                            notify();
                        }, 0);

                        $("#test").append("<input id=\"test2\" type=\"text\">");
                        var Input = Am.Model.create("Input", ["type"]);
                        var input = new Input("TEXT");
                        var element2 = Am.View.Element.create("#test2");

                        element2.addDataBinding(input, "type", {
                            elementProperties: ["type"],
                            backwardTransform: function(value) { return value.toString().toUpperCase(); }
                        });

                        $("#test2")[0].type = "email";

                        window.setTimeout(function() {
                            expect(input.get("type")).to.equal("EMAIL");
                            notify();
                        }, 0);
                    });

                    it("should respect the backward transform option on input values if it is specified",
                        function(done) {
                        $("#test").append("<input id=\"test1\" type=\"text\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element = Am.View.Element.create("#test1");

                        element.addDataBinding(person, "name", {
                            backwardTransform: function(value) { return value.toLowerCase(); }
                        });
                        $("#test1").val("John");

                        //Manually trigger change event
                        var event = document.createEvent("HTMLEvents");
                        event.initEvent("change", true, true);
                        $("#test1")[0].dispatchEvent(event);

                        window.setTimeout(function() {
                            expect(person.get("name")).to.equal("john");
                            done();
                        }, 50);
                    });

                    it("should respect the direction option if it is specified, or default to two-way binding",
                        function(done) {
                        $("#test").append("<input id=\"test1\" type=\"text\">");
                        $("#test").append("<input id=\"test2\" type=\"text\">");
                        $("#test").append("<input id=\"test3\" type=\"text\">");
                        $("#test").append("<input id=\"test4\" type=\"text\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element1 = Am.View.Element.create("#test1");
                        var element2 = Am.View.Element.create("#test2");
                        var element3 = Am.View.Element.create("#test3");
                        var element4 = Am.View.Element.create("#test4");

                        element1.addDataBinding(person, "name", { direction: Am.View.Element.ONE_WAY_BINDING });
                        element2.addDataBinding(person, "name", { direction: Am.View.Element.REVERSE_BINDING });
                        element3.addDataBinding(person, "name", { direction: Am.View.Element.TWO_WAY_BINDING });
                        element4.addDataBinding(person, "name");

                        expect($("#test1").val()).to.equal("Alan");
                        expect($("#test2").val()).to.equal("");
                        expect($("#test3").val()).to.equal("Alan");
                        expect($("#test4").val()).to.equal("Alan");

                        person.set("name", "John");
                        element1.refresh(person);
                        element2.refresh(person);
                        element3.refresh(person);
                        element4.refresh(person);

                        expect($("#test1").val()).to.equal("John");
                        expect($("#test2").val()).to.equal("");
                        expect($("#test3").val()).to.equal("John");
                        expect($("#test4").val()).to.equal("John");

                        done();
                    });
                });

                describe("instance.refresh()", function() {
                    it("should refresh the Element's HTMLElement(s)'s specified attribute (string)",
                        function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element = Am.View.Element.create("#test1");

                        element.addDataBinding(person, "name", { elementProperties: "innerHTML" });

                        expect($("#test1").html()).to.equal("Alan");

                        done();
                    });

                    it("should refresh the Element's HTMLElement(s)'s specified attribute(s) (array)",
                        function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element = Am.View.Element.create("#test1");

                        element.addDataBinding(person, "name", { elementProperties: ["innerHTML", "data-name"] });

                        expect($("#test1").html()).to.equal("Alan");
                        expect($("#test1").data("name")).to.equal("Alan");

                        done();
                    });

                    it("should refresh the Element's HTMLElement(s)'s specified data attribute(s)",
                        function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element = Am.View.Element.create("#test1");

                        element.addDataBinding(person, "name", { elementProperties: ["dataset.test", "data-name"] });

                        expect($("#test1").data("test")).to.equal("Alan");
                        expect($("#test1").data("name")).to.equal("Alan");

                        done();
                    });

                    it("should refresh the Element's HTMLElement(s)'s specified style attribute(s)",
                        function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var Shirt = Am.Model.create("Shirt", ["color"]);
                        var shirt = new Shirt("#f00");
                        var element = Am.View.Element.create("#test1");

                        element.addDataBinding(shirt, "color", { elementProperties: ["style.color"] });

                        expect(
                            $("#test1").css("color") === "#f00" ||
                            $("#test1").css("color") === "#ff0000" ||
                            $("#test1").css("color") === "rgb(255, 0, 0)"
                        ).to.be.true;

                        done();
                    });

                    it("should respect forward transforms",
                        function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test").append("<div id=\"test2\">");
                        var Person = Am.Model.create("Person", ["firstName", "lastName"]);
                        var person = new Person("Alan", "Doe");
                        var element1 = Am.View.Element.create("#test1");
                        var element2 = Am.View.Element.create("#test2");

                        element1.addDataBinding(person, "firstName", { forwardTransform: function(value) {
                            return value.toLowerCase();
                        }});

                        element2.addDataBinding(person, "firstName", { forwardTransform: function(value, instance) {
                            return value.toLowerCase() + " " + instance.get("lastName").toLowerCase();
                        }});

                        expect($("#test1").html()).to.equal("alan");
                        expect($("#test2").html()).to.equal("alan doe");

                        done();
                    });
                });

                describe("instance.removeDataBinding()", function() {
                    it("should remove the Element's HTMLElement(s)'s innerHTML bindings to the instance by default " +
                        "for non-input HTML elements", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test").append("<div id=\"test2\">");
                        $("#test").append("<div id=\"test3\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element1 = Am.View.Element.create("#test1");
                        var element2 = Am.View.Element.create("#test2, #test3");

                        element1.addDataBinding(person, "name");
                        element2.addDataBinding(person, "name");

                        element1.removeDataBinding(person, "name");
                        element2.removeDataBinding(person, "name");

                        person.set("name", "John");
                        element1.refresh(person);
                        element2.refresh(person);

                        expect($("#test1").html()).to.equal("Alan");
                        expect($("#test2").html()).to.equal("Alan");
                        expect($("#test3").html()).to.equal("Alan");

                        done();
                    });

                    it("should remove the Element's HTMLElement(s)'s value bindings to the instance by default " +
                        "for input HTML elements", function(done) {
                        $("#test").append("<input id=\"test1\" type=\"text\">");
                        $("#test").append("<input id=\"test2\" type=\"text\">");
                        $("#test").append("<input id=\"test3\" type=\"text\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var element1 = Am.View.Element.create("#test1");
                        var element2 = Am.View.Element.create("#test2, #test3");

                        element1.addDataBinding(person, "name");
                        element2.addDataBinding(person, "name");

                        element1.removeDataBinding(person, "name");
                        element2.removeDataBinding(person, "name");

                        person.set("name", "John");
                        element1.refresh(person);
                        element2.refresh(person);

                        expect($("#test1").val()).to.equal("Alan");
                        expect($("#test2").val()).to.equal("Alan");
                        expect($("#test3").val()).to.equal("Alan");

                        done();
                    });

                    it("should remove all of the Element's HTMLElement(s)'s matching data bindings", function(done) {
                        $("#test").append("<input id=\"test1\" type=\"text\">");
                        $("#test").append("<input id=\"test2\" type=\"text\">");
                        $("#test").append("<input id=\"test3\" type=\"text\">");
                        $("#test").append("<input id=\"test4\" type=\"text\">");
                        $("#test").append("<input id=\"test5\" type=\"text\">");
                        $("#test").append("<input id=\"test6\" type=\"text\">");
                        $("#test").append("<input id=\"test7\" type=\"text\">");
                        $("#test").append("<input id=\"test8\" type=\"text\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("Alan");
                        var forwardTransform = function(value) { return value; };
                        var backwardTransform = function(value) { return value; };

                        var element1 = Am.View.Element.create("#test1");
                        element1.addDataBinding(person, "name", { elementProperties: "data-name" });
                        element1.removeDataBinding(person, "name", { elementProperties: "data-name" });
                        person.set("name", "John");
                        element1.refresh(person);

                        expect($("#test1").data("name")).to.equal("Alan");

                        var element2 = Am.View.Element.create("#test2");
                        person.set("name", "Alan");
                        element2.addDataBinding(person, "name", { elementProperties: "value" });
                        element2.removeDataBinding(person, "name", { elementProperties: "data-name" });
                        person.set("name", "John");
                        element2.refresh(person);

                        expect($("#test2").val()).to.equal("John");

                        var element3 = Am.View.Element.create("#test3");
                        person.set("name", "Alan");
                        element3.addDataBinding(person, "name", { direction: Am.View.Element.ONE_WAY_BINDING });
                        element3.removeDataBinding(person, "name", { direction: Am.View.Element.ONE_WAY_BINDING });
                        person.set("name", "John");
                        element3.refresh(person);

                        expect($("#test3").val()).to.equal("Alan");

                        var element4 = Am.View.Element.create("#test4");
                        person.set("name", "Alan");
                        element4.addDataBinding(person, "name");
                        element4.removeDataBinding(person, "name", { direction: Am.View.Element.ONE_WAY_BINDING });
                        person.set("name", "John");
                        element4.refresh(person);

                        expect($("#test4").val()).to.equal("John");

                        var element5 = Am.View.Element.create("#test5");
                        person.set("name", "Alan");
                        element5.addDataBinding(person, "name", { forwardTransform: forwardTransform });
                        element5.removeDataBinding(person, "name", { forwardTransform: forwardTransform });
                        person.set("name", "John");
                        element5.refresh(person);

                        expect($("#test5").val()).to.equal("Alan");

                        var element6 = Am.View.Element.create("#test6");
                        person.set("name", "Alan");
                        element6.addDataBinding(person, "name");
                        element6.removeDataBinding(person, "name", { forwardTransform: forwardTransform });
                        person.set("name", "John");
                        element6.refresh(person);

                        expect($("#test6").val()).to.equal("John");

                        var element7 = Am.View.Element.create("#test7");
                        person.set("name", "Alan");
                        element7.addDataBinding(person, "name", { backwardTransform: backwardTransform });
                        element7.removeDataBinding(person, "name", { backwardTransform: backwardTransform });
                        person.set("name", "John");
                        element7.refresh(person);

                        expect($("#test7").val()).to.equal("Alan");

                        var element8 = Am.View.Element.create("#test8");
                        person.set("name", "Alan");
                        element8.addDataBinding(person, "name");
                        element8.removeDataBinding(person, "name", { backwardTransform: backwardTransform });
                        person.set("name", "John");
                        element8.refresh(person);

                        expect($("#test8").val()).to.equal("John");

                        done();
                    });
                });

                describe("instance.hasDataBindings()", function() {
                    it("should return whether the Element has any data bindings", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test").append("<div id=\"test2\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person1 = new Person("Alan");
                        var element1 = Am.View.Element.create("#test1");
                        var element2 = Am.View.Element.create("#test2");

                        element1.addDataBinding(person1, "name");

                        expect(element1.hasDataBindings()).to.be.true;
                        expect(element2.hasDataBindings()).to.be.false;

                        done();
                    });
                });

                describe("instance.isDataBound()", function() {
                    it("should return whether the Element is data bound to the specified instance", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test").append("<div id=\"test2\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person1 = new Person("Alan");
                        var person2 = new Person("John");
                        var element1 = Am.View.Element.create("#test1");
                        var element2 = Am.View.Element.create("#test2");

                        element1.addDataBinding(person1, "name");

                        expect(element1.isDataBoundTo(person1)).to.be.true;
                        expect(element2.isDataBoundTo(person1)).to.be.false;
                        expect(element1.isDataBoundTo(person2)).to.be.false;
                        expect(element2.isDataBoundTo(person2)).to.be.false;

                        done();
                    });
                });
            });
        });
    });
});

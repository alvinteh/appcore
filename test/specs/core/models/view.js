define(["ampedjs/core/modules/core/models/view"], function(View) {
    var Am = window.Am;

    describe("Am", function() {
        describe("View", function() {
            describe("View", function() {
                afterEach(function() {
                    $("#test").html("");
                });

                describe("View()", function() {
                    it("should accept a single HTMLElement argument", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var view = Am.View.create($("#test1")[0]);

                        expect(view.getContainerElement()).to.equal($("#test1")[0]);

                        done();
                    });

                    it("should accept a query selector matching a single HTMLElement", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var view = Am.View.create("#test1");

                        expect(view.getContainerElement()).to.equal($("#test1")[0]);

                        done();
                    });
                });

                describe("instance.getContainerElement()", function() {
                    it("should return the View's container element", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var view = Am.View.create("#test1");

                        expect(view.getContainerElement()).to.equal($("#test1")[0]);

                        done();
                    });
                });

                describe("instance.getElements()", function() {
                    it("should return the View's Element(s)", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test1").append("<div id=\"test2\">");
                        $("#test1").append("<div id=\"test3\">");
                        var view = Am.View.create("#test1");
                        Am.View.Element.create("#test2", view);
                        Am.View.Element.create("#test3", view);

                        var elements = view.getElements();

                        expect(elements.length).to.equal(2);
                        expect(elements[0].getElement()).to.equal($("#test2")[0]);
                        expect(elements[1].getElement()).to.equal($("#test3")[0]);

                        done();
                    });
                });

                describe("instance.addElement()", function() {
                    it("should add the specified Element to the View", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test1").append("<div id=\"test2\">");
                        var view = Am.View.create("#test1");
                        var element = Am.View.Element.create("#test2");

                        view.addElement(element);

                        expect(view.hasElement(element)).to.be.true;

                        done();
                    });

                    it("should ignore Elements that already exist in the View", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test1").append("<div id=\"test2\">");
                        var view = Am.View.create("#test1");
                        var element = Am.View.Element.create("#test2", view);

                        view.addElement(element);

                        view.removeElement(element);

                        expect(view.hasElement(element)).to.be.false;

                        done();
                    });

                    it("should ignore Elements that are not descendents of its container element", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test").append("<div id=\"test2\">");
                        var view = Am.View.create("#test1");
                        var element = Am.View.Element.create("#test2");

                        view.addElement(element);

                        expect(view.hasElement(element)).to.be.false;

                        done();
                    });
                });

                describe("instance.hasElement()", function() {
                    it("should check whether the specified Element exists in the View", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test1").append("<div id=\"test2\">");
                        $("#test1").append("<div id=\"test3\">");
                        var view = Am.View.create("#test1");
                        var element1 = Am.View.Element.create("#test2", view);
                        var element2 = Am.View.Element.create("#test3");

                        expect(view.hasElement(element1)).to.be.true;
                        expect(view.hasElement(element2)).to.be.false;

                        done();
                    });
                });

                describe("instance.refresh()", function() {
                    it("should refresh the View's Elements", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test1").append("<div id=\"test2\">");
                        $("#test1").append("<div id=\"test3\">");
                        var Person = Am.Model.create("Person", ["name"]);
                        var person = new Person("John");
                        var view = Am.View.create("#test1");
                        var element1 = Am.View.Element.create("#test2", view);
                        var element2 = Am.View.Element.create("#test3", view);

                        element1.addDataBinding(person, "name");
                        element2.addDataBinding(person, "name");

                        view.refresh(person);

                        expect($("#test2").html()).to.equal("John");
                        expect($("#test3").html()).to.equal("John");

                        done();
                    });
                });

                describe("instance.trigger()/instance.observe()", function() {
                    it("should return an Event with the correct target when fired", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var view = Am.View.create("#test1");

                        var eventTarget = null;

                        view.observe("test", function(event) {
                            eventTarget = event.getTarget();
                        });

                        view.trigger("test");

                        expect(eventTarget).to.equal(view);

                        done();
                    });

                    it("should return an Event with the correct event data when fired", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var view = Am.View.create("#test1");

                        var eventData = null;

                        view.observe("test", function(event) {
                            eventData = event.getData();
                        });

                        view.trigger("test", { message: "Hello" });

                        expect(eventData.message).to.equal("Hello");

                        done();
                    });
                });

                describe("instance.unobserve()", function() {
                    it("should cause the appropriate observe() listener(s) to stop firing", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var view = Am.View.create("#test1");

                        var test1Trigger = 0;
                        var test2Trigger = 0;

                        var test1Listener1 = function() {
                            test1Trigger += 1;
                        };

                        view.observe("test1", test1Listener1);

                        view.observe("test1", function() {
                            test1Trigger += 2;
                        });

                        view.observe("test2", function() {
                           test2Trigger += 1;
                        });

                        view.observe("test2", function() {
                            test2Trigger += 2;
                        });

                        view.unobserve("test1", test1Listener1);

                        view.trigger("test1");
                        view.trigger("test2");

                        expect(test1Trigger).to.equal(2);
                        expect(test2Trigger).to.equal(3);

                        test1Trigger = 0;
                        test2Trigger = 0;

                        view.unobserve("test2", test1Listener1);

                        view.trigger("test1");
                        view.trigger("test2");

                        expect(test1Trigger).to.equal(2);
                        expect(test2Trigger).to.equal(3);

                        test1Trigger = 0;
                        test2Trigger = 0;

                        view.unobserve("test2");

                        view.trigger("test1");
                        view.trigger("test2");

                        expect(test1Trigger).to.equal(2);
                        expect(test2Trigger).to.equal(0);

                        done();
                    });
                });
            });
        });
    });
});

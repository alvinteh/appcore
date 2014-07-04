define(["appcore/core/modules/core/models/view"], function(View) {
    var Am = window.Am;

    describe("Am", function() {
        describe("View", function() {
            afterEach(function() {
                $("#test").html("");
            });

            it("should be defined", function(done) {
                expect(Am.View).to.exist;

                done();
            });

            describe("create()", function() {
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

                it("should automatically add the created View to the internal records", function(done) {
                    $("#test").append("<div id=\"test1\">");
                    var view = Am.View.create("#test1");

                    expect(Am.View.has(view)).to.be.true;

                    done();
                });
            });

            describe("add()", function() {
                it("should add the specified View to the internal records", function(done) {
                    $("#test").append("<div id=\"test1\">");
                    var view = new View("#test1");

                    Am.View.add(view);

                    expect(Am.View.has(view)).to.be.true;

                    done();
                });

                it("should ignore Views that already exist in the internal records", function(done) {
                    $("#test").append("<div id=\"test1\">");
                    var view = new View("#test1");

                    Am.View.add(view);
                    Am.View.add(view);

                    Am.View.remove(view);

                    expect(Am.View.has(view)).to.be.false;

                    done();
                });
            });

            describe("remove()", function() {
                it("should remove the specified View from the internal records", function(done) {
                    $("#test").append("<div id=\"test1\">");
                    var view = Am.View.create("#test1");

                    Am.View.remove(view);

                    expect(Am.View.has(view)).to.be.false;

                    done();
                });

                it("should not throw errors if the specified View does not exist in the internal records",
                    function(done) {
                    $("#test").append("<div id=\"test1\">");
                    var view = new View("#test1");

                    expect(function() { Am.View.remove(view) }).to.not.throw();

                    done();
                });
            });

            describe("has()", function() {
                it("should check whether the specified View exists in the internal records", function(done) {
                    $("#test").append("<div id=\"test1\">");
                    var view = Am.View.create("#test1");

                    expect(Am.View.has(view)).to.be.true;

                    Am.View.remove(view);

                    expect(Am.View.has(view)).to.be.false;

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
        });
    });
});

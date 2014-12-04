define(["ampedjs/core/modules/core/models/view"], function(View) {
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

            describe("Element", function() {
                it("should be defined", function(done) {
                    expect(Am.View.Element).to.exist;

                    done();
                });

                describe("create()", function() {
                    it("should accept a single HTMLElement argument", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var element = Am.View.Element.create($("#test1")[0]);

                        expect(element.getElement()).to.equal($("#test1")[0]);

                        done();
                    });

                    it("should accept an array of HTMLElements", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test").append("<div id=\"test2\">");
                        var element = Am.View.Element.create([$("#test1")[0], $("#test2")[0]]);
                        var htmlElements = element.getElements();

                        expect(htmlElements[0]).to.equal($("#test1")[0]);
                        expect(htmlElements[1]).to.equal($("#test2")[0]);

                        done();
                    });

                    it("should accept a query selector matching a single HTMLElement", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        var element = Am.View.Element.create("#test1");

                        expect(element.getElement()).to.equal($("#test1")[0]);

                        done();
                    });

                    it("should accept a query selector matching multiple HTMLElements", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test").append("<div id=\"test2\">");
                        var element = Am.View.Element.create("#test1, #test2");
                        var htmlElements = element.getElements();

                        expect(htmlElements[0]).to.equal($("#test1")[0]);
                        expect(htmlElements[1]).to.equal($("#test2")[0]);

                        done();
                    });

                    it("should add the created Element to the specified View if applicable", function(done) {
                        $("#test").append("<div id=\"test1\">");
                        $("#test1").append("<div id=\"test2\">");
                        var view = Am.View.create("#test1");
                        var element = Am.View.Element.create("#test2", view);

                        expect(view.hasElement(element)).to.be.true;

                        done();
                    });
                });
            });
        });
    });
});

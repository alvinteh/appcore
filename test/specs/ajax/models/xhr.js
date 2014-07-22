define(function() {
    var Am = window.Am;

    Am.Module.load("Ajax").then(function() {
        var Xhr = Am.Module.get("Ajax").Xhr;

        describe("Am", function() {
            describe("Ajax", function() {
                describe("Xhr", function() {
                    it("should be defined.", function(done) {
                        expect(Xhr).to.exist;

                        done();
                    });

                    describe("instance.send()", function() {
                        var server;

                        beforeEach(function() {
                            server = sinon.fakeServer.create();
                            server.autoRespond = true;
                        });

                        afterEach(function() {
                            server.restore();
                        });

                        it("should reject if the browser does not support XMLHttpRequests or ActiveXObjects",
                            function(done) {
                            server.restore();

                            var tmp = window.XMLHttpRequest;
                            window.XMLHttpRequest = null;

                            var xhr = new Xhr("/test", Xhr.METHOD_GET);

                            server.respondWith(function(xhr) {
                                xhr.respond(200, null, "test");
                            });

                            xhr.send().then(
                                function() {
                                    window.XMLHttpRequest = tmp;
                                    server = sinon.fakeServer.create();
                                    done("Should not be here");
                                },
                                function() {
                                    window.XMLHttpRequest = tmp;
                                    server = sinon.fakeServer.create();
                                    done();
                                }
                            );
                        });

                        it("should return a Promise", function(done) {
                            var xhr = new Xhr("/test", Xhr.METHOD_GET);

                            var callback = sinon.spy();

                            server.respondWith(function(xhr) {
                                xhr.respond(200, null, "test");
                            });

                            xhr.send().then(
                                function() {
                                    callback();

                                    expect(callback).to.have.been.called;
                                    expect(xhr.getResponse()).to.equal("test");

                                    done();
                                },
                                function(error) {
                                    done(error);
                                }
                            );
                        });

                        it("should send URL parameters correctly", function(done) {
                            var xhr = new Xhr("/test", Xhr.METHOD_GET);
                            var fakeXhr;
                            xhr.setData({ param1: "value1", param2: "value//2" });

                            var callback = sinon.spy();

                            server.respondWith(function(xhr) {
                                fakeXhr = xhr;
                                xhr.respond(200, null, "test");
                            });

                            xhr.send().then(
                                function() {
                                    callback();

                                    expect(callback).to.have.been.called;
                                    expect(xhr.getResponse()).to.equal("test");
                                    expect(fakeXhr.url).to.equal("/test?param1=value1&param2=value//2");

                                    done();
                                },
                                function(error) {
                                    done(error);
                                }
                            );
                        });

                        it("should send primitive form data correctly", function(done) {
                            var xhr = new Xhr("/test", Xhr.METHOD_POST);
                            var fakeXhr;
                            xhr.setData({ param1: "value1", param2: "value//2" });

                            var callback = sinon.spy();

                            server.respondWith(function(xhr) {
                                fakeXhr = xhr;
                                xhr.respond(200, null, "test");
                            });

                            xhr.send().then(
                                function() {
                                    callback();

                                    expect(callback).to.have.been.called;
                                    expect(xhr.getResponse()).to.equal("test");
                                    expect(fakeXhr.requestBody).to.equal("param1=value1&param2=value//2");
                                    expect(fakeXhr.url).to.equal("/test");

                                    done();
                                },
                                function(error) {
                                    done(error);
                                }
                            );

                        });

                        it("should flatten and send object form data correctly", function(done) {
                            var xhr = new Xhr("/test", Xhr.METHOD_POST);
                            var fakeXhr;
                            xhr.setData({ param1: { nestedObject: { value: "a" }, value: "b" } });

                            var callback = sinon.spy();

                            server.respondWith(function(xhr) {
                                fakeXhr = xhr;
                                xhr.respond(200, null, "test");
                            });

                            xhr.send().then(
                                function() {
                                    callback();

                                    expect(callback).to.have.been.called;
                                    expect(xhr.getResponse()).to.equal("test");
                                    expect(fakeXhr.requestBody).to.equal("value=a&value=b");
                                    expect(fakeXhr.url).to.equal("/test");

                                    done();
                                },
                                function(error) {
                                    done(error);
                                }
                            );

                        });

                        it("should ignore inherited properties in object form data correctly", function(done) {
                            var xhr = new Xhr("/test", Xhr.METHOD_POST);
                            var fakeXhr;

                            var X = function() {
                                this.x = "x";
                            };

                            X.prototype = {
                                y: "y"
                            };

                            var testObject = new X();

                            xhr.setData({ param1: testObject });

                            var callback = sinon.spy();

                            server.respondWith(function(xhr) {
                                fakeXhr = xhr;
                                xhr.respond(200, null, "test");
                            });

                            xhr.send().then(
                                function() {
                                    callback();

                                    expect(callback).to.have.been.called;
                                    expect(xhr.getResponse()).to.equal("test");
                                    expect(fakeXhr.requestBody).to.equal("x=x");
                                    expect(fakeXhr.url).to.equal("/test");

                                    done();
                                },
                                function(error) {
                                    done(error);
                                }
                            );

                        });
                    });
                });
            });
        });
    });

});

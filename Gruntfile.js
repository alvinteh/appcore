module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: {
            test: {
                options: {
                    cleanup: true,
                    layout: "byComponent",
                    production: false,
                    targetDir: "test/dependencies"
                }
            }
        },
        clean: {
            dev: {
                src: ["test/dependencies/ampedjs"]
            },
            dist: {
                src: ["dist"]
            },
            test: {
                src: ["test/dependencies"]
            }
        },
        copy: {
            common: {
                expand: true,
                cwd: "src/",
                src: "**",
                dest: "test/dependencies/"
            },
            commonGruntBlanketMocha: {
                expand: true,
                cwd: "node_modules/grunt-blanket-mocha",
                src: "**",
                dest: "test/dependencies/grunt-blanket-mocha"
            }
        },
        blanket_mocha: {
            common: {
                options: {
                    log : true,
                    logErrors: true,
                    threshold: 100,
                },
                src: "test/index.html"
            }
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            common: {
                src: "src/**/*.js",
            }
        },
        requirejs: {
            distNormal: {
                options: {
                    baseUrl: "src",
                    optimize: "none",
                    out: "dist/ampedjs.js",
                    name: "app",
                    paths: {
                        jquery: "../test/dependencies/jquery/jquery",
                        app: "../../app"
                    }
                }
            },
            distMin: {
                options: {
                    baseUrl: "src",
                    optimize: "uglify2",
                    out: "dist/ampedjs.min.js",
                    name: "app",
                    paths: {
                        jquery: "../test/dependencies/jquery/jquery",
                        app: "../../app"
                    }
                }
            }
        },
        watch: {
            dev: {
                files: "src/**/*.js",
                tasks: [
                    "jshint:common",
                    "clean:dev",
                    "copy:common",
                    "blanket_mocha:common"
                ]
            }
        }
    });

    require("load-grunt-tasks")(grunt);

    grunt.registerTask("default", [
        "clean:dist",
        "requirejs:distNormal",
        "requirejs:distMin"
    ]);

    grunt.registerTask("test", [
        "jshint:common",
        "clean:test",
        "bower:test",
        "copy:commonGruntBlanketMocha",
        "copy:common",
        "blanket_mocha:common"
    ]);
};

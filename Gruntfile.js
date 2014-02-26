module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: {
            test: {
                options: {
                    cleanup: true,
                    layout: "byComponent",
                    targetDir: "test/dependencies"
                }
            }
        },
        clean: {
            dist: {
                src: ["dist"]
            },
            test: {
                src: ["test/dependencies"]
            }
        },
        copy: {
            test: {
                expand: true,
                cwd: "src/",
                src: "**",
                dest: "test/dependencies/"
            }
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            test: {
                src: "src/**/*.js",
            }
        },
        requirejs: {
            distNormal: {
                options: {
                    baseUrl: "src",
                    optimize: "none",
                    out: "dist/appcore.js",
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
                    out: "dist/appcore.min.js",
                    name: "app",
                    paths: {
                        jquery: "../test/dependencies/jquery/jquery",
                        app: "../../app"
                    }
                }
            }
        },
        watch: {
            test: {
                files: "src/**/*.js",
                tasks: ["jshint:test", "copy:test"]
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask("default", ["clean:test", "bower:test", "copy:test", "clean:dist", "requirejs:distNormal", "requirejs:distMin"]);
    grunt.registerTask("test", ["jshint:test", "clean:test", "bower:test", "copy:test"]);
};
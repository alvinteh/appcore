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
            devCss: {
                src: ["test/css"]
            },
            devJs: {
                src: ["test/dependencies/appcore"]
            },
            dist: {
                src: ["dist"]
            },
            test: {
                src: ["test/dependencies", "test/css"]
            }
        },
        compass: {
            common: {
                options: {
                    cssDir: "test/css",
                    outputStyle: "compressed",
                    raw:
                        "on_stylesheet_saved do |filename|\n" +
                            "if File.exists? (filename)\n" +
                                "FileUtils.cp(filename, filename.gsub(\".css\", \".min.css\"))\n" +
                                "FileUtils.rm(filename);\n" +
                            "end\n" +
                        "end\n",
                    sassDir: "test/scss"
                }
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
            devCss: {
                files: "test/scss/*.scss",
                tasks: ["clean:devCss", "compass:common"]
            },
            devJs: {
                files: "src/**/*.js",
                tasks: ["jshint:test", "clean:devJs", "copy:test"]
            }
        }
    });

    require("load-grunt-tasks")(grunt);

    grunt.registerTask("default", ["clean:test", "bower:test", "copy:test", "clean:dist", "requirejs:distNormal", "requirejs:distMin"]);
    grunt.registerTask("test", ["jshint:test", "clean:test", "bower:test", "compass:common", "copy:test"]);
};
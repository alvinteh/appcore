module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: {
            test: {
                options: {
                    cleanBowerDir : true,
                    cleanTargetDir: false,
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
                src: [
                        "test/dependencies/**/*",
                        "!test/dependencies/webcomponentsjs/**"
                    ]
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
                    baseUrl: "src/ampedjs",
                    optimize: "none",
                    out: "dist/ampedjs.js",
                    name: "ampedjs",
                    include: [
                        "core/modules/ajax/ajax",
                        "core/modules/collections/collections",
                        "core/modules/persistence/persistence",
                        "core/modules/util/util"

                    ]
                }
            },
            distMin: {
                options: {
                    baseUrl: "src/ampedjs",
                    optimize: "uglify2",
                    out: "dist/ampedjs.min.js",
                    name: "ampedjs",
                    include: [
                        "core/modules/ajax/ajax",
                        "core/modules/collections/collections",
                        "core/modules/persistence/persistence",
                        "core/modules/util/util"
                    ]
                }
            }
        },
        usebanner: {
                dist: {
                    options: {
                        position: "top",
                        banner: "/*!  <%= pkg.name %> <%= pkg.version %> | 2014 Alvin Teh */",
                        linebreak: true
                    },
                    files: {
                        src: [
                            "dist/ampedjs.js",
                            "dist/ampedjs.min.js"
                        ]
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
        "requirejs:distMin",
        "usebanner:dist"
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

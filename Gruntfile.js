'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});
var gateway = require('gateway');
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var packageConfig = {
        app: 'src',
        dist: 'dist'
    };

    grunt.initConfig({
        packageConfig: packageConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            livereload: {
                options: {
                    livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
                },
                files: [
                    '<%= packageConfig.app %>/**/*.html',
                    '<%= packageConfig.app %>/*.php',
                    '{.tmp,<%= packageConfig.app %>}/assets/styles/**/*.css',
                    '{.tmp,<%= packageConfig.app %>}/js/**/*.js',
                    '<%= packageConfig.app %>/assets/images/**/*.{png,jpg,jpeg,gif,webp}',
                    '<%= packageConfig.app %>/js/templates/**/*.{tpl,ejs,mustache,hbs}',
                    'test/spec/**/*.js'
                ]
            },
            jst: {
                files: [
                    '<%= packageConfig.app %>/js/templates/*.ejs'
                ],
                tasks: ['jst']
            },
            test: {
                files: ['<%= packageConfig.app %>/js/**/*.js', 'test/spec/**/*.js'],
                tasks: ['test:true']
            }
        },
        connect: {
            options: {
                port: grunt.option('port') || SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            lrSnippet,
                            gateway(__dirname + '/' + packageConfig.app, {
                                '.php': 'php-cgi'
                            }),
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, packageConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, packageConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, packageConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            },
            test: {
                path: 'http://localhost:<%= connect.test.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= packageConfig.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= packageConfig.app %>/js/**/*.js',
                '!<%= packageConfig.app %>/js/vendor/*',
                'test/spec/**/*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    baseUrl: '<%= packageConfig.app %>/js',
                    optimize: 'none',
                    paths: {
                        'jquery': '../../<%= packageConfig.app %>/com/vendor/jquery/dist/jquery',
                        'underscore': '../../<%= packageConfig.app %>/com/vendor/underscore/underscore',
                        'backbone': '../../<%= packageConfig.app %>/com/vendor/backbone/backbone',
                        'bootstrap': '../../<%= packageConfig.app %>/com/vendor/bootstrap/dist/js/bootstrap',
                        'json2': '../../<%= packageConfig.app %>/com/vendor/json2/json2',
                        'modernizr': '../../<%= packageConfig.app %>/com/vendor/modernizr/modernizr',
                        'requirejs-text': '../../<%= packageConfig.app %>/com/vendor/requirejs-text/text',
                        'requirejs': '../../<%= packageConfig.app %>/com/vendor/requirejs/require'
                    },
                    
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        useminPrepare: {
            src: ['<%= packageConfig.app %>/index.html'],
            options: {
                dest: '<%= packageConfig.dist %>'
            }
        },
        usemin: {
            html: ['<%= packageConfig.dist %>/*.html', '<%= packageConfig.dist %>/*.php', '<%= packageConfig.dist %>/js/*.js'],
            css: ['<%= packageConfig.dist %>/assets/styles/**/*.css'],
            options: {
                dirs: ['<%= packageConfig.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= packageConfig.app %>/assets/images',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: '<%= packageConfig.dist %>/assets/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= packageConfig.dist %>/assets/styles/main.css': [
                        '<%= packageConfig.app %>/assets/styles/**/*.css'
                    ]
                },
                options: {
                    keepSpecialComments: 0
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/packageConfig/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= packageConfig.app %>',
                    src: ['*.html', '*.php'],
                    dest: '<%= packageConfig.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= packageConfig.app %>',
                    dest: '<%= packageConfig.dist %>',
                    src: [
                        '*.{ico,txt,xml}',
                        '.htaccess',
                        'assets/images/**/*.{webp,gif}',
                        'assets/fonts/**/*.*',
                        'api/**/*.*',
                        'assets/styles/ext/**/*.*'
                    ]
                }]
            },
            home: {
                src: '<%= packageConfig.dist %>/index.html',
                dest: 'index.html',
                options:{
                    process: function (content, srcpath) {
                        content = content.replace(/("com)/g,'"dist/com');
                        content = content.replace(/("js)/g,'"dist/js');
                        content = content.replace(/("assets)/g,'"dist/assets');
                        return content;
                      }
                }
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= packageConfig.app %>/js/main.js'
            }
        },
        jst: {
            options: {
                amd: true
            },
            compile: {
                files: {
                    '.tmp/js/templates.js': ['<%= packageConfig.app %>/js/templates/*.ejs']
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= packageConfig.dist %>/js/**/*.js',
                        '<%= packageConfig.dist %>/assets/styles/**/*.css',
                        // '<%= packageConfig.dist %>/assets/images/**/*.{png,jpg,jpeg,gif,webp}',
                        '<%= packageConfig.dist %>/assets/styles/fonts/**/*.*',
                    ]
                }
            }
        },
        replace: {
            urls: {
                src: ['<%= packageConfig.dist %>/*.php', '<%= packageConfig.dist %>/**/*.php'],
                overwrite: true,
                replacements: []
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'ie >= 8', 'Firefox ESR', 'Opera 12.1']
            },
            dist: {
                files: [{
                    expand: true,
                    src: '<%= packageConfig.dist %>/assets/styles/**/*.css'
                }]
            }
        },
    });

    grunt.registerTask('createDefaultTemplate', function() {
        grunt.file.write('.tmp/js/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('server', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve' + (target ? ':' + target : '')]);
    });

    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open:server', 'connect:dist:keepalive']);
        }

        if (target === 'test') {
            return grunt.task.run([
                'clean:server',
                'createDefaultTemplate',
                'jst',
                'connect:test',
                'open:test',
                'watch'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'createDefaultTemplate',
            'jst',
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });

    grunt.registerTask('test', function(isConnected) {
        isConnected = Boolean(isConnected);
        var testTasks = [
            'clean:server',
            'createDefaultTemplate',
            'jst',
            'connect:test',
            'mocha',
        ];

        if (!isConnected) {
            return grunt.task.run(testTasks);
        } else {
            // already connected so not going to connect again, remove the connect:test task
            testTasks.splice(testTasks.indexOf('connect:test'), 1);
            return grunt.task.run(testTasks);
        }
    });

    grunt.registerTask('createHome', function() {
        grunt.task.run('copy:home');
    });

    grunt.registerTask('build', [
        'clean:dist',
        'createDefaultTemplate',
        'jst',
        'useminPrepare',
        'requirejs',
        // 'imagemin',
        'htmlmin',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'replace',
        'rev',
        'usemin',
        'copy:home'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
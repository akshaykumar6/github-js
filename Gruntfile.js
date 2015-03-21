var config = {
  dist: 'dist',
  bower: 'bower_components',
  src: 'src',
  banner: '/*!\n' +
          ' * <%= project.name %> - v<%= project.version %>\n'+
          ' * Copyright (c) 2015-<%= grunt.template.today("yyyy") %> <%= project.author %>\n'+
          ' */\n'
};

var project = require('./package.json');

module.exports = function(grunt) {
  grunt.initConfig({
    config: config,
    project: project,
    cssmin: {
      add_banner: {
        options: {
          banner: config.banner
        },
        files: {
          '<%= config.dist %>/github.min.css': [
            '<%= config.src %>/github.css'
          ]
        }
      }
    },
    uglify: {
      options: {
        banner: config.banner
      },
      dist: {
        files: {
          '<%= config.dist %>/github.min.js': [
            '<%= config.src %>/github.js'
          ]
        }
      }
    },
    clean: {
      build: {
        src: ["dist/*"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask( "wipe", [ "clean" ])
  grunt.registerTask( "build", ["cssmin", "uglify:dist" ] );

};
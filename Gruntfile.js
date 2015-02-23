module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      css: {
        src: [
          'resources/css/fieldtype.css',
        ],
        dest: 'resources/css/app.css',
      },
      libraries: {
        src: [   
          'resources/js/vendor/underscore.js',
          'resources/js/vendor/backbone.js',
          'resources/js/vendor/backbone.wreqr.js',
          'resources/js/vendor/backbone.babysitter.js',
          'resources/js/vendor/backbone.marionette.js',
          'resources/js/vendor/handlebars.js',
          'resources/js/vendor/jquery.simple-color-picker.js',
          'resources/js/vendor/jquery.nouislider.min.js',
        ],
        dest: 'resources/js/libraries.js',
      },
      app: {
        src: [
          'resources/js/app/main.js',
          'resources/js/app/models/Base.js',
          'resources/js/app/models/*.js',
          'resources/js/app/views/ItemView.js',
          'resources/js/app/views/LayoutView.js',
          'resources/js/app/views/*.js',
          'resources/js/app/core/*.js',
          'resources/js/app/helpers/*.js',
        ],
        dest: 'resources/js/app.js',
      },
      compiled: {
        src: [
          'resources/js/libraries.js',
          'resources/js/templates.js',
          'resources/js/app.js',
        ],
        dest: 'resources/js/app.compiled.js'
      }
    },
    handlebars: {
      all: {
          files: {
              'resources/js/templates.js': [
                'resources/js/app/templates/*.handlebars',
                'resources/js/app/templates/**/*.handlebars',
              ]
          }
      },
    },
    uglify: {
      options: {
        mangle: false,
        compress: false,
        drop_console: true,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'resources/js/app.min.js': ['resources/js/app.compiled.js'],
          // 'resources/js/front-libraries.min.js': ['<%= concat.frontEnd.dest %>'],
          // 'resources/js/timeblocker.min.js': 'resources/js/timeblocker.compiled.js',
        }
      }
    },
    cssmin: {
      app: {
        src: 'resources/css/app.css',
        dest: 'resources/css/app.min.css'
      }
    },
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['<%= concat.app.src %>'],
        tasks: ['concat'],
      },
      css: {
        files: ['<%= concat.css.src %>'],
        tasks: ['concat'],
      },
      handlebars: {
        files: [
          'resources/js/app/templates/*.handlebars',
          'resources/js/app/templates/**/*.handlebars'
        ],
        tasks: ['handlebars', 'concat'],
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-handlebars-compiler');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['handlebars', 'concat', 'uglify', 'cssmin', 'watch']);

};
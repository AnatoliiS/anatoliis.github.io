module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Clean the dist folder
    clean: {
      build: ['dist']
    },

    // Copy assets
    copy: {
      main: {
        expand: true,
        cwd: 'src/assets/',
        src: ['**', '!img/**'], // Exclude the img folder
        dest: 'dist/',
      },
    },

    // Optimize images
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/assets/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/img/',
        }],
      },
    },

    // Convert images to WebP format
    cwebp: {
      dynamic: {
        options: {
          q: 75
        },
        files: [{
          expand: true,
          cwd: 'src/assets/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/img/',
        }],
      },
    },

    // Compile SCSS to CSS
    sass: {
      options: {
        implementation: require('sass'),
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/scss',
          src: ['**/*.scss'],
          dest: 'dist/css',
          ext: '.css',
        }],
      },
    },

    // Minify CSS
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.min.css',
        }],
      },
    },

    // Compile Pug to HTML
    pug: {
      compile: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'src/pug',
          src: ['**/*.pug'],
          dest: 'dist',
          ext: '.html'
        }]
      }
    },

    // Minify HTML
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['**/*.html'],
          dest: 'dist',
          ext: '.html'
        }]
      }
    },

    // Watch for changes
    watch: {
      scripts: {
        files: ['src/js/**/*.js'],
        tasks: ['uglify'],
      },
      css: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass', 'cssmin'],
      },
      images: {
        files: ['src/assets/img/**/*.{png,jpg,gif}'],
        tasks: ['imagemin', 'cwebp'],
      },
      assets: {
        files: ['src/assets/**/*'],
        tasks: ['copy'],
      },
      pug: {
        files: ['src/pug/**/*.pug'],
        tasks: ['pug', 'htmlmin'],
      },
    },

    // Minify JavaScript
    uglify: {
      build: {
        files: [{
          expand: true,
          cwd: 'src/js',
          src: '**/*.js',
          dest: 'dist/js',
          ext: '.min.js',
        }],
      },
    },

    // BrowserSync
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'dist/css/*.css',
            'dist/js/*.js',
            'dist/*.html'
          ]
        },
        options: {
          watchTask: true,
          server: './dist'
        }
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-cwebp');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-browser-sync');

  // Default task(s)
  grunt.registerTask('prod', ['clean', 'copy', 'imagemin', 'cwebp', 'sass', 'cssmin', 'pug', 'htmlmin', 'uglify']);
  grunt.registerTask('dev', ['clean', 'copy', 'imagemin', 'cwebp', 'sass', 'cssmin', 'pug']);
  grunt.registerTask('serve', ['browserSync', 'watch']);
  grunt.registerTask('flush', ['clean']);
};
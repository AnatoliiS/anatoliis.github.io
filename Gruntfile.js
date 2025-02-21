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
          src: ['styles.purged.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.min.css',
        }],
      },
    },

    // Purge unused CSS
    purgecss: {
      options: {
        content: ['dist/**/*.html', 'dist/js/**/*.js']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.purged.css'
        }]
      }
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

    // Replace version query parameter in HTML
    replace: {
      dist: {
        src: ['dist/*.html'], // Source files array
        dest: 'dist/', // Destination directory
        replacements: [
          {
            from: /(\.css)\?v=\d+\.\d+\.\d+/g, // Regex replacement
            to: '$1'
          }
        ]
      }
    },

    // Generate critical CSS
    critical: {
      dist: {
        options: {
          base: 'dist/',
          css: ['dist/css/styles.min.css*'],
          width: 1300,
          height: 900,
          inline: true, // Inline the critical CSS
          extract: true, // Extract the critical CSS
          ignore: ['@font-face', /url\(/], // Ignore @font-face and url()
          penthouse: {
            puppeteer: {
              executablePath: '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe', // Path to Chrome on Windows
              args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for WSL
            }
          }
        },
        src: 'dist/index.html',
        dest: 'dist/index.html' // Inline critical CSS into the original HTML file
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
        tasks: ['sass', 'purgecss', 'cssmin'],
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
  grunt.loadNpmTasks('grunt-critical');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-purgecss');

  // Default task(s)
  grunt.registerTask('prod', ['clean', 'copy', 'imagemin', 'cwebp', 'sass', 'purgecss', 'cssmin', 'pug', 'htmlmin', 'uglify']);
  grunt.registerTask('dev', ['clean', 'copy', 'imagemin', 'cwebp', 'sass', 'purgecss', 'cssmin', 'pug']);
  grunt.registerTask('serve', ['browserSync', 'watch']);
  grunt.registerTask('critcss', ['replace', 'purgecss', 'cssmin', 'critical']);
  grunt.registerTask('flush', ['clean']);
};
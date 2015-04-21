module.exports = function (grunt) {
    var banner = '/*!\n' +
        ' <%= bowerConfig.name %>\n <%= bowerConfig.description%>\n\n ' +
        'version: <%= bowerConfig.version%>\n ' +
        'author: <%= bowerConfig.authors.name%>\n' +
        'date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*/\n';

    grunt.initConfig({
        bowerConfig: grunt.file.readJSON('bower.json'),

        clean: {
            build: {
                src: 'dist'
            }
        },
        concat: {
            options: {
                separator: '\n',
                banner: banner,
                stripBanners:true
            },
            dist: {
                src: [
                    'public/js/browser.js',

                    'public/js/bower_components/jquery/dist/jquery.min.js',
                    'public/js/bower_components/bootstrap/dist/js/bootstrap.min.js',

                    'public/js/*.js',


                    'public/js/website/lib/fss.min.js',
                    'public/js/website/lib/example.js',
                    'public/js/website/lib/snowfall.jquery.js',

                    'src/main.js',
                    'src/import/jsExtend.js',
                    'src/import/yeQuery.js' ,

                    'src/base/Entity.js',
                    'src/base/Node.js',
                    'src/base/*.js',

                    'src/action/Action.js',
                    'src/action/ActionInstant.js',
                    'src/action/ActionInterval.js',
                    'src/action/Control.js',

                    'src/loader/Loader.js',

                    'src/**/*.js'
                ],
                dest: 'dist/yEngine2D.js'
            }
        },
        uglify: {
            options: {
                banner: banner
            },
            build: {
                src: 'dist/yEngine2D.js',
                dest: 'dist/yEngine2D.min.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
                }]
            }
        }
//        jshint: {
//            all: ['dist/*.js']
//        },
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
//    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('build', ['clean', 'concat', 'uglify']);
};
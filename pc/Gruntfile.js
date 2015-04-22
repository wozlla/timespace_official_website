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
            basic:{
                src: [
                    'public/js/bower_components/jquery/dist/jquery.min.js',
                    'public/js/bower_components/bootstrap/dist/js/bootstrap.min.js',

                    'public/js/website/global.js',
                    'public/js/website/animation.js',
                    'public/js/website/nav.js'
                ],
                dest: 'dist/footer.js'
            },
            extra:{
                src: [
                    //'public/js/website/lib/fss.min.js',
                    //'public/js/website/lib/example.js',
                    'public/js/website/lib/snowfall.jquery.js',
                    'public/js/website/index/index.js'
                ],
                dest: 'dist/index.js'
            },
            builda:{
                src: [
                    'public/js/website/tryPlay/tryPlay.js'
                ],
                dest: 'dist/tryPlay.js'
            },
            buildb:{
                options:{
                   //sourceMap:true
                },
                files: {
                    'dist/header.css': ['public/js/bower_components/bootstrap/dist/css/bootstrap.css',
                        'public/css/website/app.css']
                }
            },
            buildc:{
                options:{
                    //sourceMap:true
                },
                files: {
                    'dist/index.css': ['public/css/website/index/index.css',
                    'public/css/website/banner.css'
                    ]
                }
            },

            buildd:{
                options:{
                    //sourceMap:true
                },
                files: {
                    'dist/tryPlay.css': [
                        'public/css/website/tryPlay/mask.css',
                        'public/css/website/tryPlay/tryPlay.css',
                    'public/css/website/tryPlay/tryPlayNav.css',
                        'public/css/website/tryPlay/banner.css'
                    ]
                }
            }
        },
        uglify: {
            options: {
                banner: banner
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: '*.js',
                    dest: 'dist',
                    ext:'.js'
                }]
            }
        },
        cssmin: {
            options:{
                advanced:false
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist',
                    ext: '.css'
                }]
            }
        }
        //concat_css: {
        //    options: {
        //
        //    },
        //    builda:{
        //        files: {
        //            'dist/header.css': ['public/js/bower_components/bootstrap/dist/css/bootstrap.css',
        //                'public/css/website/app.css']
        //        }
        //    },
        //    buildb:{
        //        files: {
        //            'dist/index.css': ['public/css/website/index/index.css']
        //        }
        //    }
        //}
    });


    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-concat-css');
//    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('build', ['clean', 'concat']);
    //grunt.registerTask('build', ['clean', 'concat', 'uglify', 'cssmin']);
};
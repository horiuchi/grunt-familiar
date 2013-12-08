module.exports = function (grunt) {
  "use strict";
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({

    familiar: {
      defaults: true,
    },

    typescript: {
      plugin: {
        src: 'src/familiar.ts',
        dest: 'tasks',
        options: {
          base_path: 'src/',
        }
      },
      test: {
      }
    },

    clean: {
      test: [
        'test/**/*.js',
      ],
    },

    watch: {
      plugin: {
        files: [ 'src/familiar.ts', ],
        tasks: [ 'typescript:plugin', 'familiar' ],
      },
    },

  });

  grunt.loadTasks('tasks');
  for (var taskName in pkg.devDependencies) {
    if (taskName.substring(0, 6) === 'grunt-') {
      grunt.loadNpmTasks(taskName);
    }
  }

  grunt.registerTask('build', ['typescript']);
  grunt.registerTask('test', ['clean', 'typescript']);
  grunt.registerTask('default', ['test']);
}


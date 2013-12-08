///<reference path="./node.d.ts" />
"use strict";

var grunt = require('grunt');
var asyncblock = require('asyncblock');

module.exports = function (grunt) {
  grunt.registerTask('familiar', 'familiar task', function() {
    grunt.verbose.writeln('called familiar task');
    var configs = defaultConfig();

    var done = this.async();
    asyncblock((flow) => {
      for (var name in configs) {
        var config = configs[name];
        flow.sync(executeOtherTool(config, flow.callback()));
      }
      grunt.verbose.ok();
      done();
    });
  });
}


interface IConfigData {
  checkFile: string;
  cmd: string;
  args: string[];
  //warnMsg: string;
}

function defaultConfig(): { [name: string]: IConfigData } {
  return {
    npm: {
      checkFile: 'package.json',
      cmd: 'npm',
      args: [ 'install' ],
    },
    bower: {
      checkFile: 'bower.json',
      cmd: 'bower',
      args: [ 'install' ],
    },
  };
}

function executeOtherTool(config: IConfigData, callback: Function): void {
  if (!grunt.file.exists(config.checkFile)) {
    grunt.verbose.writeln(config.checkFile + ' is not found.');
    return callback(null, false);
  }
  grunt.verbose.writeln(config.checkFile + ' is found.');

  grunt.util.spawn(config,
    (err, result, code) => {
      grunt.verbose.writeln(String(result));
      if (err) {
        grunt.log.errorlns(err);
        callback(err);
      } else {
        grunt.log.ok(config.cmd + ' ' + config.args.join(' ') + ' completed.');
        callback(null, true);
      }
    });
}


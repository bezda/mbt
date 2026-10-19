module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ts: {
      default : {
        // use tsconfig.json located in same directory as Gruntfile.js
        tsconfig: true,
        options: {
          verbose: true
        }
      }
    },
    debian_package: {
      default_options: {
        options: {
          short_description: "Config scripts for thirdparty mocks",
          long_description: "Configuration files for mountebank server",
          target_architecture: "all",
          category: "misc",
          custom_template: "custom_template/",
          preinst: {
            src: 'debian_package/preinst'
          },
          postinst: {
            src: 'debian_package/postinst'
          },
          dependencies: "mountebank (>= 2.3.3), haproxy",
          directories: [
            '/var/log/fsapp/thirdparty-mocks',
          ]
        },
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: [
              '**'
            ],
            dest: '/usr/share/freeside/thirdparty-mocks/'
          },
          {
            expand: true,
            cwd: 'dist/',
            src: [
              '**'
            ],
            dest: '/usr/share/freeside/thirdparty-mocks/'
          },
          {
            expand: true,
            cwd: 'node_modules/',
            src: [
              '**'
            ],
            dest: '/usr/share/freeside/thirdparty-mocks/node_modules/'
          },
          {
            src:  'package.json',
            dest: '/usr/share/freeside/thirdparty-mocks/'
          },
          {
            src: 'debian_package/thirdparty-mocks-server.sh',
            dest: '/usr/bin/thirdparty-mocks-server'
          },
          {
            src: 'debian_package/thirdparty-mocks-server@.service',
            dest: '/usr/lib/systemd/system/'
          },
          {
            src: 'debian_package/thirdparty-mocks-haproxy.service',
            dest: '/usr/lib/systemd/system/'
          }
        ]
      }
    }
  });

  grunt.registerTask('default', ['ts', 'haproxy_cfg', 'debian_package']);
  grunt.registerTask('haproxy_cfg', 'Create haproxy.cfg from available imposters', function() {
    grunt.log.writeln('Currently running the "haproxy_cfg" task.');
    var fe_acls = ""
    var fe_rules = ""
    var backends = ""
    grunt.file.expand("src/*/imposter.ejs").forEach(function(imposter) {
      var imposter_file = grunt.file.read(imposter)
      var port = imposter_file.match(/"port": ?(\d+),/)[1]
      var data =  {data: {imposter: imposter.split('/')[1], port: port}}
      fe_acls += grunt.template.process("\tacl host_<%= imposter %>\thdr_beg(host) <%= imposter %>.\n", data)
      fe_acls += grunt.template.process("\tacl host_<%= imposter %>\thdr(host) <%= imposter %>\n", data)
      fe_acls += grunt.template.process("\tacl host_<%= imposter %>\thdr(host) <%= imposter %>-mock\n", data)
      fe_rules += grunt.template.process("\tuse_backend <%= imposter %>\tif host_<%= imposter %>\n",  data)
      backends += grunt.template.process("backend <%= imposter %>\n\tserver <%= imposter %> localhost:<%= port %> check\n", data)
    })
    var haproxy_cfg_template = grunt.file.read("src/haproxy.cfg.template")
    var haproxy_cfg = grunt.template.process(haproxy_cfg_template, {data: {
      fe_acls: fe_acls,
      fe_rules: fe_rules,
      backends: backends
    }})
    grunt.file.write("src/haproxy.cfg", haproxy_cfg)
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks('grunt-debian-package');
};

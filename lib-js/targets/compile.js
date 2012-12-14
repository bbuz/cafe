// Generated by CoffeeScript 1.3.3
(function() {
  var async, compile, fs, get_adaptors, help, is_file, make_target, path, say, scream, shout, whisper, _ref,
    __slice = [].slice;

  help = ["Compiles modules using appropriate adapters.\nSkips a module if it hasn't changed since the last time by default.\n\nParameters:\n    - src        - full path to a module. Other path arguments will be ignored \n                   should this argument be specified,\n                   \n    - app_root   - base path for compiling.\n                   (Note that target compile path is set by the slug.json from\n                   base path dir),\n\n    - mod_name   - module name,\n\n    - js_path    - dir to put compiled file to,\n\n    - mod_suffix - suffix to put between app_root and mod_name,\n\n    - t          - compile tests (default false),\n    - f          - force compile without checking if there was any changes in files."];

  fs = require('fs');

  path = require('path');

  async = require('async');

  is_file = require('../lib/utils').is_file;

  get_adaptors = require('../lib/adaptor');

  make_target = require('../lib/target').make_target;

  _ref = (require('../lib/logger'))('Compile>'), say = _ref.say, shout = _ref.shout, scream = _ref.scream, whisper = _ref.whisper;

  compile = function(ctx, cb) {
    var app_root, do_it_factory, done, harvest_cb, mapper, mod_name;
    if (!((ctx.own_args.app_root && ctx.own_args.mod_name) || ctx.own_args.src)) {
      scream("app_root/mod_name or src arguments missing");
      return cb('ctx_error');
    }
    app_root = ctx.own_args.app_root;
    mod_name = ctx.own_args.mod_name;
    do_it_factory = function(adaptor_factory, mapper_cb) {
      return function(err, matches) {
        if (!err && matches) {
          return mapper_cb(adaptor_factory.make_adaptor(ctx));
        } else {
          return mapper_cb(void 0);
        }
      };
    };
    mapper = function(adaptor_factory, mapper_cb) {
      return adaptor_factory.match.async(ctx, do_it_factory(adaptor_factory, mapper_cb));
    };
    harvest_cb = function(err, results) {
      console.log(results);
      return cb(err);
    };
    done = function() {
      var adaptr, results;
      results = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      adaptr = (results.filter(function(x) {
        return x !== void 0;
      }))[0];
      if (adaptr) {
        return adaptr.harvest(harvest_cb);
      } else {
        ctx.fb.scream("No adaptor found");
        return cb('adaptor_error');
      }
    };
    return async.map(get_adaptors(), mapper, done);
  };

  module.exports = make_target("compile", compile, help);

}).call(this);

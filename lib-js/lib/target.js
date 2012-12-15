// Generated by CoffeeScript 1.4.0
(function() {
  var TARGET_PATH, events, is_debug_context, make_target, murmur, path, run_target, say, scream, shout, whisper, _ref, _ref1;

  events = require('events');

  path = require('path');

  _ref = require('../lib/utils'), is_debug_context = _ref.is_debug_context, is_debug_context = _ref.is_debug_context;

  _ref1 = require('../lib/logger')("Target factory>"), say = _ref1.say, shout = _ref1.shout, scream = _ref1.scream, whisper = _ref1.whisper, murmur = _ref1.murmur;

  TARGET_PATH = require('../defs').TARGET_PATH;

  run_target = function(target_name, args, ctx, success_cb, error_cb) {
    var emitter, target;
    emitter = ctx.emitter;
    try {
      target = require(path.join(TARGET_PATH, target_name));
      return target.run(args, emitter, ctx.fb, success_cb);
    } catch (ex) {
      if (error_cb) {
        return error_cb(ex);
      } else {
        scream("Exception raised while executing target `" + target_name + "`: '" + ex + "'");
        scream("" + ex.stack);
        ctx.fb.scream("Unknown target `" + target_name + "`'");
        ctx.fb.scream("Exception raised while executing target `" + target_name + "`: '" + ex + "'");
        ctx.fb.whisper("" + ex.stack);
        return typeof success_cb === "function" ? success_cb('target_error', ex) : void 0;
      }
    }
  };

  make_target = function(name, exec_func, help, single) {
    var run, validate_params;
    run = function(full_args, emitter, fb, cb) {
      var ctx;
      ctx = {
        name: name,
        worker: exec_func,
        help: help,
        debug: function() {
          return is_debug_context(ctx);
        },
        full_args: full_args,
        own_args: full_args[name] || {},
        emitter: emitter,
        fb: fb,
        cafelib: {
          utils: require('./utils'),
          make_compiler: require('./compiler/compiler')
        },
        print_help: function(cb) {
          var h, _i, _len, _ref2;
          if (ctx.help) {
            _ref2 = ctx.help;
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              h = _ref2[_i];
              fb.murmur(h);
            }
          } else {
            fb.shout('No help for this target');
          }
          return typeof cb === "function" ? cb() : void 0;
        }
      };
      Object.freeze(ctx.full_args);
      Object.freeze(ctx.own_args);
      if (ctx.own_args.hasOwnProperty('help')) {
        return ctx.print_help(function() {
          return cb('exit_help');
        });
      } else {
        return ctx.worker(ctx, cb);
      }
    };
    validate_params = function() {
      return void 0;
    };
    return Object.freeze({
      run: run,
      validate_params: validate_params
    });
  };

  module.exports = {
    make_target: make_target,
    run_target: run_target
  };

}).call(this);

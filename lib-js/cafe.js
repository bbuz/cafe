// Generated by CoffeeScript 1.4.0
(function() {
  "This is Cafe's main module.";

  var EVENT_BUNDLE_CREATED, EVENT_CAFE_DONE, EXIT_HELP, EXIT_NO_STATUS_CODE, EXIT_OTHER_ERROR, EXIT_PARTIAL_SUCCESS, EXIT_SIGINT, EXIT_SIGTERM, EXIT_SUCCESS, EXIT_TARGET_ERROR, EXIT_VERSION_MISMATCH, TARGET_PATH, VERSION, async, events, fs, get_plugins, head, is_debug_context, murmur, nocolor, panic_mode, path, run_target, say, scream, shout, shutup, trim, uuid, whisper, _ref, _ref1, _ref2;

  head = ["Cafe is the build system for client side applications (and more).\nIt is written in Coffescript in functional and asyncronous way.\n\nThis is a CLI UI for Cafe v.1\n\nParameters:\n    -- debug     - include stack traces and other debug info\n                   into output\n\n    -- nologo    - exclude logo from output, usefull for sub-commands;\n\n    -- nocolor   - do not use color in output, usefull\n                   when directing Cafe's output into a log file;\n\n    -- shutup    - exclude info and warning messages from output.\n                   Error and debug messages will be preserved;\n\n    -- version   - returns the current Cafe's version;\n\n    --nogrowl    - disables growl notifications.\n\n    -- help      - this help.\n\nSub-commands:"];

  fs = require('fs');

  path = require('path');

  async = require('async');

  events = require('events');

  uuid = require('node-uuid');

  run_target = require('./lib/target').run_target;

  _ref = require('./lib/utils'), trim = _ref.trim, is_debug_context = _ref.is_debug_context, get_plugins = _ref.get_plugins;

  _ref1 = (require('./lib/logger'))(), say = _ref1.say, shout = _ref1.shout, scream = _ref1.scream, whisper = _ref1.whisper, murmur = _ref1.murmur, shutup = _ref1.shutup, panic_mode = _ref1.panic_mode, nocolor = _ref1.nocolor;

  _ref2 = require('./defs'), VERSION = _ref2.VERSION, TARGET_PATH = _ref2.TARGET_PATH, EVENT_CAFE_DONE = _ref2.EVENT_CAFE_DONE, EVENT_BUNDLE_CREATED = _ref2.EVENT_BUNDLE_CREATED, EXIT_SUCCESS = _ref2.EXIT_SUCCESS, EXIT_TARGET_ERROR = _ref2.EXIT_TARGET_ERROR, EXIT_OTHER_ERROR = _ref2.EXIT_OTHER_ERROR, EXIT_HELP = _ref2.EXIT_HELP, EXIT_SIGINT = _ref2.EXIT_SIGINT, EXIT_NO_STATUS_CODE = _ref2.EXIT_NO_STATUS_CODE, EXIT_SIGTERM = _ref2.EXIT_SIGTERM, EXIT_PARTIAL_SUCCESS = _ref2.EXIT_PARTIAL_SUCCESS, EXIT_VERSION_MISMATCH = _ref2.EXIT_VERSION_MISMATCH;

  module.exports = function(emitter) {
    var Emitter, ID, START_TIME, Target_path, get_targets, get_version, no_action_handler, ready, run_seq, show_help_and_exit, show_version_and_exit, target_run_factory;
    Target_path = TARGET_PATH;
    Emitter = emitter || new events.EventEmitter;
    START_TIME = void 0;
    ID = uuid.v4();
    no_action_handler = function(fb) {
      return show_help_and_exit(fb);
    };
    show_help_and_exit = function(fb) {
      (head.concat((get_targets()).map(function(t) {
        return "    " + t;
      }))).map(function(l) {
        return fb.murmur(l);
      });
      return Emitter.emit(EVENT_CAFE_DONE, EXIT_HELP);
    };
    show_version_and_exit = function(fb) {
      fb.say("Current version: " + (get_version()));
      return Emitter.emit(EVENT_CAFE_DONE, EXIT_HELP);
    };
    target_run_factory = function(target_name, full_args, proto_ctx) {
      return function(cb) {
        return run_target(target_name, full_args, proto_ctx, cb);
      };
    };
    ready = function(_arg) {
      var bundles, emitter, exit_cb, fb, go, proto_ctx, target_path;
      target_path = _arg.target_path, emitter = _arg.emitter, exit_cb = _arg.exit_cb, fb = _arg.fb;
      if (target_path) {
        Target_path = target_path;
      }
      if (emitter) {
        Emitter = emitter;
      }
      proto_ctx = {
        emitter: Emitter,
        fb: fb
      };
      bundles = [];
      Emitter.on(EVENT_BUNDLE_CREATED, function(bundle_source) {
        return bundles.push(bundle_source);
      });
      Emitter.on(EVENT_CAFE_DONE, function(status) {
        say("Coffee " + ID + " brewed in <" + ((new Date - START_TIME) / 1000) + " seconds> at " + (new Date));
        fb.say("Coffee " + ID + " brewed in <" + ((new Date - START_TIME) / 1000) + " seconds> at " + (new Date));
        return exit_cb((status === void 0 ? EXIT_NO_STATUS_CODE : status), bundles);
      });
      go = function(_arg1) {
        var args, cb;
        args = _arg1.args;
        cb = function() {
          var seq, target, _ref3, _ref4;
          if ((_ref3 = args.global) != null ? _ref3.hasOwnProperty('help') : void 0) {
            return show_help_and_exit(fb);
          } else if ((_ref4 = args.global) != null ? _ref4.hasOwnProperty('version') : void 0) {
            return show_version_and_exit(fb);
          } else {
            seq = (function() {
              var _results;
              _results = [];
              for (target in args) {
                if (target !== "global") {
                  _results.push(target_run_factory(target, args, proto_ctx));
                }
              }
              return _results;
            })();
            if (seq.length === 0) {
              return no_action_handler(fb);
            } else {
              return run_seq(args, seq, fb);
            }
          }
        };
        if ((typeof process.getuid === "function" ? process.getuid() : void 0) === 0) {
          return run_target('update', args, proto_ctx, cb);
        } else {
          return cb();
        }
      };
      return {
        go: go
      };
    };
    run_seq = function(argv, seq, fb) {
      var done,
        _this = this;
      START_TIME = new Date;
      done = function(error, results) {
        var EXIT_STATUS;
        if (error == null) {
          error = null;
        }
        switch (error) {
          case null:
            EXIT_STATUS = EXIT_SUCCESS;
            break;
          case 'stop':
            EXIT_STATUS = EXIT_SUCCESS;
            break;
          case 'sigint':
            whisper('Sigint from outer world');
            fb.whisper('Sigint from outer world');
            EXIT_STATUS = EXIT_SIGINT;
            break;
          case 'target_error':
            whisper('Error from task');
            fb.whisper('Error from task');
            EXIT_STATUS = EXIT_TARGET_ERROR;
            break;
          case 'sub_cafe_error':
            whisper("Error from sub-cafe: " + results);
            fb.whisper("Error from sub-cafe: " + results);
            EXIT_STATUS = results;
            break;
          case 'partial_success':
            whisper("Finished with errors: " + results);
            fb.whisper("Finished with errors: " + results);
            EXIT_STATUS = EXIT_PARTIAL_SUCCESS;
            break;
          case 'version_mismatch':
            whisper("No further processing will be taken");
            fb.whisper("No further processing will be taken");
            EXIT_STATUS = EXIT_VERSION_MISMATCH;
            break;
          case 'exit_help':
            EXIT_STATUS = EXIT_HELP;
            break;
          case 'bad_recipe':
            scream("" + results);
            fb.scream("" + results);
            EXIT_STATUS = EXIT_OTHER_ERROR;
            break;
          case 'bad_ctx':
            scream("" + results);
            fb.scream("" + results);
            EXIT_STATUS = EXIT_OTHER_ERROR;
            break;
          default:
            scream("Error encountered: " + error);
            whisper("" + error.stack);
            fb.scream("Error encountered: " + error);
            fb.whisper("" + error.stack);
            EXIT_STATUS = EXIT_OTHER_ERROR;
        }
        return Emitter.emit(EVENT_CAFE_DONE, EXIT_STATUS, error);
      };
      return async.series(seq, done);
    };
    get_version = function() {
      return VERSION;
    };
    get_targets = function() {
      return (get_plugins(TARGET_PATH)).map(function(target_name) {
        return target_name;
      });
    };
    return {
      ready: ready,
      get_version: get_version,
      get_targets: get_targets
    };
  };

}).call(this);

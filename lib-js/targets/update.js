// Generated by CoffeeScript 1.4.0
(function() {
  var CB_SUCCESS, CLEANUP_CMD, EVENT_CAFE_DONE, EXIT_SUCCESS, SUB_CAFE, UPDATE_CMD, VERSION, build_update_reenter_cmd, exec, filter_dict, fs, help, make_target, maybe_update, path, reenter, request, say, scream, shout, spawn, trim, whisper, _ref, _ref1, _ref2, _ref3,
    __slice = [].slice;

  help = ["Updates Cafe from the repo if newer version is available. \nRe-runs updated cafe with the arguments passed alongside with 'update'.\n\nParameters:\n\n    --help\n        this help"];

  fs = require('fs');

  path = require('path');

  request = require('request');

  _ref = require('child_process'), spawn = _ref.spawn, exec = _ref.exec;

  make_target = require('../lib/target').make_target;

  _ref1 = require('../lib/utils'), trim = _ref1.trim, filter_dict = _ref1.filter_dict;

  _ref2 = (require('../lib/logger'))('Update>'), say = _ref2.say, shout = _ref2.shout, scream = _ref2.scream, whisper = _ref2.whisper;

  _ref3 = require('../defs'), SUB_CAFE = _ref3.SUB_CAFE, VERSION = _ref3.VERSION, EVENT_CAFE_DONE = _ref3.EVENT_CAFE_DONE, EXIT_SUCCESS = _ref3.EXIT_SUCCESS, CLEANUP_CMD = _ref3.CLEANUP_CMD, UPDATE_CMD = _ref3.UPDATE_CMD, CB_SUCCESS = _ref3.CB_SUCCESS;

  build_update_reenter_cmd = function(ctx) {
    var arg, arg1, arg2, args, cmd_args, command, format_arg, val, _ref4, _ref5;
    arg1 = function(arg) {
      return "-" + arg;
    };
    arg2 = function(arg, val) {
      return "--" + arg + (val === void 0 ? '' : '=' + val);
    };
    format_arg = function(arg, val) {
      if (val === true) {
        return arg1(arg);
      } else {
        return arg2(arg, val);
      }
    };
    cmd_args = ['--nologo', '--noupdate'];
    _ref4 = ctx.global;
    for (arg in _ref4) {
      val = _ref4[arg];
      if (arg !== 'update') {
        cmd_args.push(format_arg(arg, val));
      }
    }
    _ref5 = filter_dict(ctx, function(k, v) {
      return k !== 'global' && k !== 'update';
    });
    for (command in _ref5) {
      args = _ref5[command];
      cmd_args.push("" + command);
      for (arg in args) {
        val = args[arg];
        cmd_args.push(format_arg(arg, val));
      }
    }
    return cmd_args;
  };

  reenter = function(ctx, cb) {
    var cmd_args, rlog, run;
    cmd_args = build_update_reenter_cmd(ctx.full_args);
    ctx.fb.say("Re-entering with '" + (cmd_args.join(' ')) + "'");
    run = spawn(SUB_CAFE, cmd_args);
    rlog = (require('../lib/logger'))('Reenter>');
    run.stdout.on('data', function(data) {
      return ctx.fb.say(("" + data).replace(/\n$/, ''));
    });
    run.stderr.on('data', function(data) {
      return ctx.fb.scream(("" + data).replace(/\n$/, ''));
    });
    return run.on('exit', function(code) {
      ctx.fb.shout("Re-enter finished with code " + code);
      return typeof cb === "function" ? cb('stop') : void 0;
    });
  };

  maybe_update = function(ctx, cb) {
    var reenter_cb, run, _ref4;
    if ((_ref4 = ctx.full_args.global) != null ? _ref4.hasOwnProperty('noupdate') : void 0) {
      return cb();
    }
    run = function(ctx, cmd, run_cb) {
      var args, child, _ref5;
      _ref5 = cmd.split(' '), cmd = _ref5[0], args = 2 <= _ref5.length ? __slice.call(_ref5, 1) : [];
      child = spawn(cmd, args);
      child.stdout.on('data', function(data) {
        return ctx.fb.say(("" + data).replace(/\n$/, ''));
      });
      child.stderr.on('data', function(data) {
        return ctx.fb.shout(("" + data).replace(/\n$/, ''));
      });
      return child.on('exit', function(rc) {
        return run_cb(CB_SUCCESS, rc);
      });
    };
    reenter_cb = function() {
      return ctx.emitter.emit(EVENT_CAFE_DONE, EXIT_SUCCESS);
    };
    return run(ctx, CLEANUP_CMD, function(err, rc) {
      return run(ctx, UPDATE_CMD, function(err, rc) {
        if (rc === 0) {
          ctx.fb.say("Cafe update succeeded");
          return reenter(ctx, reenter_cb);
        } else {
          ctx.fb.shout("Cafe update failed: " + code);
          return cb();
        }
      });
    });
  };

  module.exports = make_target("update", maybe_update, help);

}).call(this);
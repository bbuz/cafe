// Generated by CoffeeScript 1.4.0
(function() {
  var CB_SUCCESS, COFFEESCRIPT_EXT, and_, async, cs, fs, get_mtime, get_paths, has_ext, is_file, path, say, scream, shout, whisper, _ref, _ref1, _ref2;

  fs = require('fs');

  path = require('path');

  _ref = require('../../lib/utils'), is_file = _ref.is_file, has_ext = _ref.has_ext, get_mtime = _ref.get_mtime, and_ = _ref.and_;

  _ref1 = (require('../../lib/logger'))("Adaptor/javascript>"), say = _ref1.say, shout = _ref1.shout, scream = _ref1.scream, whisper = _ref1.whisper;

  async = require('async');

  cs = require('coffee-script');

  _ref2 = require('../../defs'), COFFEESCRIPT_EXT = _ref2.COFFEESCRIPT_EXT, CB_SUCCESS = _ref2.CB_SUCCESS;

  get_paths = function(ctx) {
    var app_root, module_name;
    app_root = path.resolve(ctx.own_args.app_root);
    module_name = ctx.own_args.mod_name;
    return {
      source_fn: path.resolve(app_root, module_name),
      target_fn: path.resolve(app_root, module_name)
    };
  };

  module.exports = (function() {
    var make_adaptor, match;
    match = function(ctx) {
      var source_fn;
      source_fn = get_paths(ctx).source_fn;
      return (is_file(source_fn)) && (has_ext(source_fn, COFFEESCRIPT_EXT));
    };
    match.async = function(ctx, cb) {
      var source_fn;
      source_fn = get_paths(ctx).source_fn;
      return async.parallel([
        (function(is_file_cb) {
          return is_file.async(source_fn, is_file_cb);
        }), (function(is_file_cb) {
          return has_ext.async(source_fn, COFFEESCRIPT_EXT, is_file_cb);
        })
      ], function(err, res) {
        if (!err && (and_.apply(null, res))) {
          return cb(CB_SUCCESS, true);
        } else {
          return cb(CB_SUCCESS, false);
        }
      });
    };
    make_adaptor = function(ctx) {
      var get_deps, harvest, last_modified, type;
      type = 'plain_javascript_file';
      get_deps = function(recipe_deps, cb) {
        var deps, group, group_deps, module_name;
        module_name = ctx.own_args.mod_name;
        for (group in recipe_deps) {
          deps = recipe_deps[group];
          if (group === module_name) {
            group_deps = deps.concat();
          }
        }
        return cb(CB_SUCCESS, group_deps || []);
      };
      harvest = function(cb) {
        var source, target_fn;
        target_fn = get_paths(ctx).target_fn;
        if (is_file(target_fn)) {
          source = cs.compile(fs.readFileSync(target_fn, 'utf8'));
          return cb(CB_SUCCESS, {
            sources: {
              filename: target_fn,
              source: source,
              type: "commonjs"
            }
          }, "COMPILE_MAYBE_SKIPPED");
        } else {
          return cb(CB_SUCCESS, void 0);
        }
      };
      last_modified = function(cb) {
        var source_fn;
        source_fn = get_paths(ctx).source_fn;
        return cb(CB_SUCCESS, get_mtime(source_fn));
      };
      return {
        type: type,
        get_deps: get_deps,
        harvest: harvest,
        last_modified: last_modified
      };
    };
    return {
      match: match,
      make_adaptor: make_adaptor
    };
  })();

}).call(this);

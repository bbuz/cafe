help = [
    """
    Initializes new client side application skelethon.

    Parameters:
      - app_root - [optional, default - 'cs'] - client side application root (where your modules will be stored).
                    Will be created if not exists, or just add recipe json to existing 
                    folder.

      - build_root - [optional, default - 'public'] - 
                      folder for storing processed js bundles. Will be created if not exists.

    Creates menu file with commands:
      - build   - simple application build
      - fbuild  - force build
      - wbuild  - build and watch application files.

    cafe init menu - generates only menu file
    """
]

fs = require 'fs'
path = require 'path'
{is_dir, is_file, exists} = require '../lib/utils'
recipe_etalon_path = path.resolve __dirname, '../../assets/templates/init/recipe/recipe.yaml'
init_html_file_path = path.resolve __dirname, '../../assets/templates/init/init.html'
{make_target} = require '../lib/target'
{make_skelethon} = require '../lib/skelethon/skelethon'
menu = require '../lib/menu'
mkdirp = require '../../third-party-lib/mkdirp'
async = require 'async'

DEFAULT_APP_ROOT = 'cs'
DEFAULT_BUILD_ROOT = 'public'


app_init = (ctx, cb) ->
    [arg1] = Object.keys(ctx.full_args).filter (i) -> i not in ['global', 'init']

    {app_root, build_root} = ctx.own_args

    app_root or= DEFAULT_APP_ROOT
    build_root or=DEFAULT_BUILD_ROOT

    # app_root 
    create_app_root = (cb) ->
        unless exists app_root
            mkdirp app_root, (err) ->
                ctx.fb.say "Created app_root - #{app_root}."
                cb()
        else
            ctx.fb.shout "app_root #{app_root} exists. Skip creating"
            cb()

    create_init_html_file = (cb) ->
        init_file_path = path.join path.resolve(path.dirname app_root), "init.html"
        init_file = fs.readFile init_html_file_path, (err, result) ->
            fs.writeFile init_file_path, result, (err) ->
                cb()

    # build root
    create_build_root = (cb) ->
        # recipe.json
        create_recipe_json = () ->
            recipe = fs.readFileSync recipe_etalon_path
            fs.writeFileSync (path.join app_root, 'recipe.yaml'), recipe
            ctx.fb.say "#{app_root}/recipe.yaml file created"
            cb()

        unless exists build_root
            mkdirp build_root, (err) ->
                ctx.fb.say "Created build_root - #{build_root}."
                create_recipe_json()

        else
            ctx.fb.shout "build_root #{build_root} exists. Skip creating"
            create_recipe_json()


    create_menu_file = (cb) ->
        build = 
            build:
                app_root: app_root
                build_root: build_root
                formula: 'recipe.yaml'

        force = 
            build:
                app_root: app_root
                build_root: build_root
                formula: 'recipe.yaml'
                f: true 

        watch = 
            build:
                app_root: app_root
                build_root: build_root
                formula: 'recipe.yaml'
                w: true

        update =
            build:
                app_root: app_root
                build_root: build_root
                formula: 'recipe.yaml'
                u: true

        menu._do_new_menu 'build', {full_args: build, fb: ctx.fb}
        menu._do_new_menu 'force', {full_args: force, fb: ctx.fb}
        menu._do_new_menu 'watch', {full_args: watch, fb: ctx.fb}
        menu._do_new_menu 'update', {full_args: update, fb: ctx.fb}

        cb()

    if arg1 is "menu"
        create_menu_file ->
            cb 'stop'
    else
        ctx.fb.say 'Initializing new client side app'
        async.parallel [
            create_app_root
            create_build_root
            create_menu_file
            create_init_html_file
            ], (err, results) ->
                cb 'stop'

module.exports = make_target "init", app_init, help

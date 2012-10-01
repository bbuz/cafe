fs = require 'fs'
path = require 'path'
{extend} = require 'underscore'

CONFIG_FILE = path.resolve process.env.HOME, '.cafe.json'

read_json_file = (filename) ->
    if fs.existsSync filename
        try
            Object.freeze(JSON.parse(fs.readFileSync(filename, 'utf-8')))
        catch e
            console.error "Can't read #{CONFIG_FILE}: #{e}"
    else
        {}

user_config = read_json_file CONFIG_FILE

REPO_URL = 'http://kyle.uaprom/coffeescript/'
VERSION_FILE = 'VERSION'
CAFE_TARBALL = 'cafe.tar.gz'

VERSION_FILE_PATH = path.resolve __dirname, "..", VERSION_FILE

VERSION = do ->
    try
        (fs.readFileSync(VERSION_FILE_PATH).toString()).replace /^\s+|\s+$/g, ''
    catch e
        undefined

TMP_BUILD_DIR_SUFFIX = 'build'

TARGET_PATH = path.resolve __dirname, './targets/'
ADAPTORS_PATH = path.resolve __dirname, "./adaptors"
ADAPTORS_LIB = path.resolve __dirname, "./adaptors"

SUB_CAFE = path.resolve __dirname, '../bin/cafe'


default_config =
    VERSION: VERSION
    VERSION_FILE_PATH: VERSION_FILE_PATH

    SLUG_FN: 'slug.json'

    FILE_ENCODING: 'utf-8'

    TMP_BUILD_DIR_SUFFIX: TMP_BUILD_DIR_SUFFIX
    CS_ADAPTOR_PATH_SUFFIX: 'domain/'

    CS_EXT: '.coffee'
    JS_EXT: '.js'
    BUILD_FILE_EXT: '.js'
    COFFEE_PATTERN: /\.coffee$/
    JS_PATTERN: /\.js$/

    MINIFY_MIN_SUFFIX: '-min.js'
    MINIFY_EXCLUDE_PATTERN: /\-min\.js$/i
    MINIFY_INCLUDE_PATTERN: /\.js$/i

    EOL: '\n'
    BUNDLE_HDR: "/* Cafe #{VERSION} #{new Date} */\n"
    BUNDLE_ITEM_HDR: (file_path) -> "/* ZB:#{path.basename file_path} */\n"
    BUNDLE_ITEM_FTR: ';\n'


    TARGET_PATH: TARGET_PATH
    ADAPTORS_PATH: ADAPTORS_PATH
    ADAPTORS_LIB: ADAPTORS_LIB

    WATCH_FN_PATTERN: /^[^\.].+\.coffee$|^[^\.].+\.json$|^[^\.].+\.eco|^[^\.].+\.js$/i

    RECIPE_EXT: '.json'
    RECIPE: "recipe.json"
    BUILD_DEPS_FN: 'build_deps.json'
    RECIPE_API_LEVEL: 3

    MENU_FILENAME: './Menufile'


    VERSION_CHECK_URL: "#{REPO_URL}cafe/#{VERSION_FILE}"
    UPDATE_CMD: "sudo npm install -g #{REPO_URL}#{CAFE_TARBALL}"

    EVENT_CAFE_DONE: 'CAFE_DONE'

    EXIT_SUCCESS: 0
    EXIT_TARGET_ERROR: 1
    EXIT_OTHER_ERROR: 2
    EXIT_HELP: 3
    EXIT_SIGINT: 4
    EXIT_NO_STATUS_CODE: 5
    EXIT_SIGTERM: 6
    EXIT_PARTIAL_SUCCESS: 7
    EXIT_VERSION_MISMATCH: 8

    SIGTERM: 15
    SIGINT: 2
    PR_SET_PDEATHSIG: 1

    TELNET_UI_HOST: '0.0.0.0'
    TELNET_UI_PORT: 8888

    SUB_CAFE: SUB_CAFE

    LISPY_BIN: 'lispy'
    LISPY_EXT: 'lspy'

    CLOJURESCRIPT_BIN: 'cljsc'
    CLOJURESCRIPT_EXT: 'cljs'

    LEIN_BIN: 'lein'
    LEIN_ARGS: 'cljsbuild once'
    PROJECT_CLJ: 'project.clj'

    LIVESCRIPT_BIN: 'livescript'
    LIVESCRIPT_EXT: 'ls'

    CAKE_BIN: 'cake'
    CAKEFILE: 'Cakefile'
    CAKE_TARGET: 'cafebuild'
    CAFE_TMP_BUILD_ROOT_ENV_NAME: 'CAFE_TMP_BUILD_ROOT'
    CAFE_TARGET_FN_ENV_NAME: 'CAFE_TARGET_FN'

    NODE_PATH: process.env.NODE_PATH

    TELNET_CMD_MARKER: 0xff
    IAC_WILL_ECHO: [0xff,0xfb,0x1]
    IAC_WONT_ECHO: [0xff,0xfc,0x1]

    CB_SUCCESS: null

    UI_CMD_PREFIX: '/'

    CS_RUN_CONCURRENT: true

    CLOJURESCRIPT_OPTS: '{:optimizations :simple :pretty-print true}'
    JS_JUST_EXT: 'js'

module.exports = extend {}, default_config, user_config

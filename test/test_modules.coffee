{construct_module} = require '../src/lib/build/modules'

exports.test_modules_creation_from_string = (test) ->
    [err, parsed, module] = construct_module {module1:'module1.coffee'}
    test.ok parsed is true, "Module parsed indicator must be true"
    test.ok !err?, "Error occured #{err}"

    test.ok(module.name is 'module1'
            "Wrong module name, expected - module1, recieved - #{module.name}")

    test.ok(module.path is 'module1.coffee'
            "Wrong module path, exptected - module1.coffee, recieved - #{module.path}")

    test.ok(module.type is 'commonjs',
        "Wrong module type. Expected - commonjs, recieved - #{module.type}")
    test.ok module.location is 'fs'

    test.done()


exports.test_module_creation_from_object = (test) ->
    [err, parsed, module] = construct_module {module1: {path:'module1.coffee', type:'plainjs'}}
    test.ok parsed is true, "Module parsed indicator must be true"
    test.ok !err?, "Error occured #{err}"

    test.ok(module.name is 'module1'
            "Wrong module name, expected - module1, recieved - #{module.name}")

    test.ok(module.path is 'module1.coffee'
            "Wrong module path, exptected - module1.coffee, recieved - #{module.path}")

    test.ok module.type is 'plainjs'
    test.ok module.location is 'fs'
    test.done()


exports.test_module_creation_from_list = (test) ->
    [err, parsed, module] = construct_module {module1: ['module1.coffee', 'plainjs']}
    test.ok parsed is true, "Module parsed indicator must be true"
    test.ok !err?, "Error occured #{err}"

    test.ok(module.name is 'module1'
            "Wrong module name, expected - module1, recieved - #{module.name}")

    test.ok(module.path is 'module1.coffee'
            "Wrong module path, exptected - module1.coffee, recieved - #{module.path}")

    test.ok module.type is 'plainjs'
    test.ok module.location is 'fs'

    [err2, parsed2, module2] = construct_module {module2: ["module2.coffee", ["module2_dep"]]}
    test.ok parsed2 is true, "Module parsed indicator must be true"
    test.ok !err2?, "Error occured #{err2}"
    test.ok(module2.name is 'module2'
            "Wrong module name, expected - module2, recieved - #{module2.name}")

    test.ok(module2.path is 'module2.coffee'
            "Wrong module path, exptected - module2.coffee, recieved - #{module2.path}")

    test.ok module2.type is 'commonjs', "Module type must be commonjs by default. Recieved - #{module2.type}"
    test.ok "module2_dep" in module2.deps, "Module2 must have module2_dep in dependencies"

    [err3, parsed3, module3] = construct_module {module3: ["module3.coffee", "plainjs", ["module3_dep"]]}
    test.ok parsed3 is true, "Module parsed indicator must be true"
    test.ok !err3?, "Error occured #{err3}"

    test.ok(module3.name is 'module3'
            "Wrong module name, expected - module3, recieved - #{module3.name}")

    test.ok(module3.path is 'module3.coffee'
            "Wrong module path, exptected - module2.coffee, recieved - #{module3.path}")

    test.ok module3.type is 'plainjs', "Module type must be plainjs. Recieved - #{module3.type}"
    test.ok "module3_dep" in module3.deps, "Module3 must have module2_dep in dependencies"

    test.done()



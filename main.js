
require("main");

server.CONST.LOG.MAX_KEY_LEN = 1000;

//for old msg 
//server.CONST.NET.DEFAULT_MSGID = "_msg_id";
//modify server timeout at here
//server.CONST.NET.TIMEOUT = 30000;			//default is 30 seconds

//set some global thing at here
server.CONST_SERVER = require("./logic/common/const");

var fs = require("fs");
var path = require("path");
var protobuf = require("protobufjs");

server.on("init", function () {
    var modules = fs.readdirSync("./logic/utils");
    for (var j = 0; j < modules.length; j++) {
        var module_name = modules[j];
        if (path.extname(module_name) === ".js" || path.extname(module_name) === ".bjs") {
            try {
                var fname = path.basename(module_name);
                fname = fname.slice(0, fname.lastIndexOf("."));
                server[fname] = require("./logic/utils/" + module_name);
            }
            catch (e) {
                server.log_err("require module : %j failed , %j", module_name, e);
            }
        }
    }

    //read all data first
    server.data = {};
    var files = fs.readdirSync("./data");
    for (var i = 0; i < files.length; i++) {
        var name = files[i];
        if (path.extname(name) === ".json") {
            try {
                var data = fs.readFileSync("./data/" + name, "utf8");
                server.data[path.basename(name, ".json")] = JSON.parse(data);
            }
            catch (e) {
                server.log_err("read file : %j failed , %j", name, e);
            }
        }
    }
    //server.log("./logic/common/init");
    require("./logic/common/init");
});

server.start({
    socket_handler: {
        webserver: require("./logic/web_handler")
    },
    websocket_handler: {
        client: require("./logic/client_handler")
    }
});


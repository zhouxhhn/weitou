
var db = server.db.game;

//--- init server ---//
server.db_drop = function (collection) {
    db.exist(collection, function (ret) {
        if (ret) {
            db.drop(collection);
        }
    });
};

server.mapReduce = function (collection, map_fn, reduce_fn, options, cb) {
    db.count(collection, function (ret) {
        if (ret > 0) {
            if (typeof cb === "function") {
                db.mapReduce(collection, map_fn, reduce_fn, options, cb);
            }
            else {
                db.mapReduce(collection, map_fn, reduce_fn, options);
            }
        }
        else {
            if (typeof cb === "function") {
                cb([]);
            }
            else if (typeof options === "function") {
                options([]);
            }
            else {
                server.log("server mapreduce arguments invalid .");
            }
        }
    });
};

//for prepare
server.prepare = false;
server.preparestop = false;

//init some global data

server.on("dynamic", function (dynamic) {
    server.log("dynamic.ini has change!!");
    if (!server.prepare) {
        return;
    }
});

//load all mgr

//be careful, it has order
var mgr_arr_first = [];
mgr_arr_first.push(server.web_mgr = require("./web_mgr"));

var mgr_arr_all = [];

var mgr_arr = [];

server.fn.async(mgr_arr_first, "prepare", function () {

    mgr_arr.push(server.client_mgr = require("./client_mgr"));
    mgr_arr.push(server.user_mgr = require("./user_mgr"));

    server.fn.async(mgr_arr, "prepare", function () {

        //sync init other data
        var _cb = function () {
            server.log("---------- server prepare ok ----------");
            server.prepare = true;
        };

        var fn_arr = [];

        server.fn.async(fn_arr, function (fn, cb) {
            fn(cb);
        }, _cb);
    });

    for (var j = 0; j < mgr_arr.length; j++) {
        mgr_arr_all.push(mgr_arr[j]);
    }
});

for (var i = 0; i < mgr_arr_first.length; i++) {
    mgr_arr_all.push(mgr_arr_first[i]);
}

server.on("stop", function () {
    server.prepare = false;
    server.preparestop = true;
    server.fn.async(mgr_arr_all, "stop", function () {
        server.log("---------- server stop ok ----------");
        server.stop();
    });
});


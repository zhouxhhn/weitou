
var handler = module.exports;
var SYS_MSG = server.CONST.SYS_MSG;
var CS_MSG = server.CONST_SERVER.CS_MSG;
var SC_MSG = server.CONST_SERVER.SC_MSG;
var ERR_MSG = server.CONST_SERVER.ERR_MSG;
var COMMON_NOTCHECK = server.CONST_SERVER.COMMON_NOTCHECK;

handler[SYS_MSG.COMMON] = function (msgid, msg, s) {
    if (msgid !== SYS_MSG.CONNECT && msgid !== SYS_MSG.CLOSE) {
        if (!server.prepare) {
            s.destroy();
            return true;
        }
    }
    
    return false;
};

handler[SYS_MSG.CONNECT] = function (msg, s) {
    server.log("client connected. " + s.remoteAddress + "   " + s.remotePort);

    if (!server.prepare) {
        s.destroy();
        return true;
    }
};

handler[SYS_MSG.CLOSE] = function (msg, s) {
    server.log("client closed. " + s.remoteAddress);

    var userid = s.userid;
    var roomtype = s.roomtype;
    if (server.web_mgr.roles[userid] != undefined) {
        server.web_mgr.roles[userid].s = null;
    }

    if (roomtype == 1 || roomtype == 2 || roomtype == 3) {
        server.web_mgr.leaveroom(roomtype, userid);
    }

    s.userid = undefined;
    s.roomtype = undefined;
};

handler[CS_MSG.CLIENT_HB] = function (msg, s) {
    //
};

handler[CS_MSG.VERIFYCONNECTION] = function (msg, s) {
    server.log(msg);

    if (msg.roomtype != 1 && msg.roomtype != 2 && msg.roomtype != 3) {
        var _msg = {
            "status": "fail",
            "errmsg": ERR_MSG.ESTABLISHCONNFAIL
        };
        s.send(SC_MSG.VERIFYCONNECTION, _msg);
        return;
    }
    var sign_data = server.fn.aes_decode(msg.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        var _msg = {
            "status": "fail",
            "errmsg": ERR_MSG.ESTABLISHCONNFAIL
        };
        s.send(SC_MSG.VERIFYCONNECTION, _msg);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        var _msg = {
            "status": "fail",
            "errmsg": ERR_MSG.ESTABLISHCONNFAIL
        };
        s.send(SC_MSG.VERIFYCONNECTION, _msg);
        return;
    }

    var user = server.user_mgr.getuser(sign_data.userid);
    if (user == undefined) {
        server.log("user is undefined");
        var _msg = {
            "status": "fail",
            "errmsg": ERR_MSG.ESTABLISHCONNFAIL
        };
        s.send(SC_MSG.VERIFYCONNECTION, _msg);
        return;
    }

    if (user.sign != "" && user.sign != msg.sign) {
        var now = Date.now();
        if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
            server.log("ERR");
            var _msg = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SIGN_EXPIRE
            };
            s.send(SC_MSG.VERIFYCONNECTION, _msg);
            return;
        }
    }

    var callback = function (gold) {
        var _msg = {
            "status": "succ",
            "errmsg": "",
            "gold": gold
        };
        s.send(SC_MSG.VERIFYCONNECTION, _msg);

        server.log(_msg);
        s.userid = sign_data.userid;
        s.roomtype = msg.roomtype;
        if (server.web_mgr.roles[sign_data.userid] == undefined) {
            server.web_mgr.roles[sign_data.userid] = { s: s };
        }
        else {
            if (server.web_mgr.roles[sign_data.userid].s === null) {
                server.web_mgr.roles[sign_data.userid].s = s;
            }
            else {
                server.log("ERR_____");
            }
        }

        server.web_mgr.enterroom(msg.roomtype, sign_data.userid);
    };
    server.web_mgr.selfinformation({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var _msg = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(_msg);
            s.send(SC_MSG.VERIFYCONNECTION, _msg);
            return;
        }
        if (data.code == 0) {
            callback(data.gold);
        }
        else {
            var _msg = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(_msg);
            s.send(SC_MSG.VERIFYCONNECTION, _msg);
        }
    });
};

handler[CS_MSG.WEIXINCHATRECORD] = function (msg, s) {
    server.log(msg);

    var _msg = {
        "roomtype": msg.roomtype,
        "index": msg.index,
        "gettype": msg.gettype,
        "count": msg.count
    }
    server.web_mgr.chatrecord(_msg, function (data) {
        //server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            s.send(SC_MSG.WEIXINCHATRECORD, ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": "",
                "roomtype": msg.roomtype,
                "roles": {},
                "records": []
            };

            for (var i = 0; i < data.records.length; i++) {
                if (ret.roles[data.records[i].userid] == undefined) {
                    ret.roles[data.records[i].userid] = { name: data.records[i].name, head: data.records[i].head };
                }

                var o = {
                    userid: data.records[i].userid,
                    index: data.records[i].index,
                    texttype: data.records[i].texttype,
                    text: data.records[i].text,
                    time: data.records[i].time
                };
                ret.records.push(o);
            }

            server.log(ret);
            s.send(SC_MSG.WEIXINCHATRECORD, ret);
            //server.log(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            s.send(SC_MSG.WEIXINCHATRECORD, ret);
        }
    });
};

handler[CS_MSG.CHAT] = function (msg, s) {
    server.log(msg);
    var _msg = {
        "userid": msg.userid,
        "roomtype": msg.roomtype,
        "texttype": msg.texttype,
        "text": msg.text
    };

    server.log(_msg);
    server.web_mgr.chat(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            s.send(SC_MSG.CHAT, ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": data.errmsg,
                "gold": data.gold
            };
            server.log(ret);
            s.send(SC_MSG.CHAT, ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg,
                "gold": data.gold
            };
            server.log(ret);
            s.send(SC_MSG.CHAT, ret);
        }
    });
};

handler[CS_MSG.DATATABLE] = function (msg, s) {
    server.log(msg);

    var _msg = {
        "userid": s.userid,
        "roomtype": msg.roomtype,
        "index": msg.index
    }
    server.web_mgr.datatable(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            s.send(SC_MSG.DATATABLE, ret);
            return;
        }

        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": "",
                "roomtype": data.roomtype,
                "index": data.index,
                "data": data.data
            };
            server.log(ret);
            s.send(SC_MSG.DATATABLE, ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            s.send(SC_MSG.DATATABLE, ret);
        }
    });
};

handler[CS_MSG.VIEWPLAYER] = function (msg, s) {
    server.log(msg);

    var arr = server.web_mgr.rooms[msg.roomtype];
    if (arr == undefined) {
        var ret = {
            "status": "fail",
            "errmsg": "DATA ERROR !"
        };
        server.log(ret);
        s.send(SC_MSG.VIEWPLAYER, ret);
        return;
    }

    var _msg = {
        "roomtype": msg.roomtype,
        "arr": []
    }
    for (var i = 0; i < arr.length; i++) {
        var userid = arr[i];
        _msg.arr.push(userid);
    }
    server.log(_msg);
    server.web_mgr.viewplayer(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            s.send(SC_MSG.VIEWPLAYER, ret);
            return;
        }

        if (data.code == 0) {

            var ret = {
                "status": "succ",
                "errmsg": "",
                "roomtype": msg.roomtype,
                "players": []
            };

            var players = data.data;
            for (var i = 0; i < _msg.arr.length; i++) {
                var userid = _msg.arr[i];
                if (players[userid] != undefined) {
                    var o = {
                        userid: userid,
                        name: players[userid].name,
                        head: players[userid].head
                    };
                    ret.players.push(o);
                }
            }
            var robots = data.data2;
            if (robots != undefined) {
                for (var i = 0; i < robots.length; i++) {
                    var robot = robots[i];
                    var o = {
                        userid: robot.userid,
                        name: robot.name,
                        head: robot.head
                    };
                    ret.players.push(o);
                }
            }
            server.log(ret);
            s.send(SC_MSG.VIEWPLAYER, ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            s.send(SC_MSG.VIEWPLAYER, ret);
        }
    });
};

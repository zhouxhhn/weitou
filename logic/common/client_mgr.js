
var ERR_MSG = server.CONST_SERVER.ERR_MSG;
var user_class = require("../class/user");
var express = require("express");

function client_mgr() {
    
};

client_mgr.prototype.prepare = function (cb) {
    server.log("do client_mgr prepare");
    
    //server.http.client_server.use(express.cookieParser());
    //the key and secret, just for laugh
    //server.http.client_server.use(express.cookieSession({ key: "ER_GE", secret: "ya bu zhu" }));
    //server.http.client_server.use(express.session({ key: "ER_GE", secret: "ya bu zhu" }));

    server.http.client_server.post("/heartbeat", this.heartbeathandle.bind(this));
    server.http.client_server.post("/picicode", this.picicodehandle.bind(this));
    server.http.client_server.post("/register", this.registerhandle.bind(this));
    server.http.client_server.post("/login", this.loginhandle.bind(this));
    server.http.client_server.post("/relogin", this.reloginhandle.bind(this));
    server.http.client_server.post("/hall", this.hallhandle.bind(this));
    server.http.client_server.post("/selfinformation", this.selfinformationhandle.bind(this));
    server.http.client_server.post("/modifyname", this.modifynamehandle.bind(this));
    server.http.client_server.post("/modifypwd", this.modifypwdhandle.bind(this));
    server.http.client_server.post("/transfergold", this.transfergoldhandle.bind(this));
    server.http.client_server.post("/transferrecord", this.transferrecordhandle.bind(this));
    server.http.client_server.post("/bank", this.bankhandle.bind(this));
    server.http.client_server.post("/bandingbankcard", this.bandingbankcardhandle.bind(this));
    server.http.client_server.post("/safebox", this.safeboxhandle.bind(this));
    server.http.client_server.post("/safeboxstore", this.safeboxstorehandle.bind(this));
    server.http.client_server.post("/safeboxdrawout", this.safeboxdrawouthandle.bind(this));
    server.http.client_server.post("/rechargedetail", this.rechargedetailhandle.bind(this));
    server.http.client_server.post("/withdrawcash", this.withdrawcashhandle.bind(this));
    server.http.client_server.post("/phonebetdata", this.phonebetdatahandle.bind(this));
    server.http.client_server.post("/phonebet", this.phonebethandle.bind(this));
    server.http.client_server.post("/quitgame", this.quitgamehandle.bind(this));
    server.http.client_server.post("/notice", this.noticehandle.bind(this));
    server.http.client_server.post("/checkqrcode", this.checkqrcodehandle.bind(this));
    server.http.client_server.post("/modifytwopwd", this.modifytwopwdhandle.bind(this));
    server.http.client_server.post("/rechargectl", this.rechargectlhandle.bind(this));
    server.http.client_server.post("/syncgold", this.syncgoldhandle.bind(this));
    server.http.client_server.post("/getbackpwd", this.getbackpwdhandle.bind(this));
    server.http.client_server.post("/getbacktwopwd", this.getbacktwopwdhandle.bind(this));
    server.http.client_server.post("/roomcheck", this.roomcheckhandle.bind(this));
    server.http.client_server.post("/getspreadconf", this.getspreadconfhandle.bind(this));
    server.http.client_server.post("/userspread", this.userspreadhandle.bind(this));
    server.http.client_server.post("/receivespread", this.receivespreadhandle.bind(this));
    server.http.client_server.post("/spreadtotalnumber", this.spreadtotalnumberhandle.bind(this));
    server.http.client_server.post("/spreadtodaynumber", this.spreadtodaynumberhandle.bind(this));
    server.http.client_server.post("/yesterdayprofit", this.yesterdayprofithandle.bind(this));
    server.http.client_server.post("/todayprofit", this.todayprofithandle.bind(this));
    server.http.client_server.post("/weekprofit", this.weekprofithandle.bind(this));
    server.http.client_server.post("/lastweekprofit", this.lastweekprofithandle.bind(this));
    server.http.client_server.post("/monthprofit", this.monthprofithandle.bind(this));
    server.http.client_server.post("/subdetailed", this.subdetailedhandle.bind(this));
    server.http.client_server.post("/footballurl", this.footballurlhandle.bind(this));
    server.http.client_server.post("/isbindsecurity", this.isbindsecurityhandle.bind(this));
    server.http.client_server.post("/bindsecurity", this.bindsecurityhandle.bind(this));
    server.http.client_server.post("/getactivity", this.getactivityhandle.bind(this));
    server.http.client_server.post("/getcarousel", this.getcarouselhandle.bind(this));
    server.http.client_server.post("/getguide", this.getguidehandle.bind(this));
    server.http.client_server.post("/getdetailed", this.getdetailedhandle.bind(this));
    cb();
};

client_mgr.prototype.stop = function (cb) {
    server.log("do client_mgr stop");
    cb();
};

client_mgr.prototype.callbackhandle = function (req, res) {

};

client_mgr.prototype.heartbeathandle = function (req, res) {
    //server.log(res);
    server.log(" recv msg id ---> heartbeat");
    var body = req.body;

    //server.log(body);
    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined || sign_data.userid == undefined) {
        var ret = {
            "status": "expire",
            "errmsg": ERR_MSG.SIGN_ERR,
            "newsign": ""
        };
        server.log(ret);
        res.send(ret);
        return;
    }
    //server.log(sign_data.userid);
    var user = server.user_mgr.getuser(sign_data.userid);
    if (user == undefined) {
        var ret = {
            "status": "expire",
            "errmsg": ERR_MSG.SIGN_ERR,
            "newsign": ""
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (user.sign != body.sign) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE,
            "newsign": ""
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    var signobj = { userid: sign_data.userid, time: Date.now() };
    var sign = server.fn.aes_encode(signobj, server.CONST_SERVER.SERVER_KEY);

    user.sign = sign;

    var ret = {
        "status": "succ",  //succ or fail
        "errmsg": "",
        "newsign": sign
    };
    //server.log(ret);
    res.send(ret);
};

client_mgr.prototype.loginhandle = function (req, res) {
    server.log("recv msg login");
    var body = req.body;

    server.log(body);
    
    var _msg = {
        acc: body.token,
        password: body.pwd
    };
    server.web_mgr.login(_msg, function (data) {
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        server.log(data);
        if (data.code == 0) {
            var now = Date.now();
            var user = server.user_mgr.getuser(data.userid);
            if (user != undefined) {
                if (user.sign != "") {
                    var sign_data = server.fn.aes_decode(user.sign, server.CONST_SERVER.SERVER_KEY);
                    if (sign_data == undefined) {
                        server.log("ERR");
                        return;
                    }
                    server.log(now - sign_data.time);
                    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
                        user.sign = server.fn.aes_encode({ userid: data.userid, time: now }, server.CONST_SERVER.SERVER_KEY);
                    }
                    else {
                        if (user.sign != body.sign) {
                            var ret = {
                                "status": "fail",  //succ or fail
                                "errmsg": ERR_MSG.NO_LOGIN
                            };
                            server.log(ret);
                            res.send(ret);
                            return;
                        }
                    }
                }
                else {
                    user.sign = server.fn.aes_encode({ userid: data.userid, time: now }, server.CONST_SERVER.SERVER_KEY);
                }
            }
            else {
                var sign = server.fn.aes_encode({ userid: data.userid, time: now }, server.CONST_SERVER.SERVER_KEY);
                user = new user_class({ userid: data.userid, sign: sign });
                server.user_mgr.push(user);
            }

            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "userid": data.userid,
                "head": data.head,
                "gold": data.gold,
                "name": data.name,
                "sign": user.sign
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg, //提示
                "userid": 0,
                "head": "",
                "gold": 0,
                "name": "",
                "sign": ""
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.reloginhandle = function (req, res) {
    server.log("recv msg relogin");
    var body = req.body;

    server.log(body);

    var _msg = {
        acc: body.token,
        password: body.pwd
    };
    server.web_mgr.login(_msg, function (data) {
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        server.log(data);
        if (data.code == 0) {
            var now = Date.now();
            var user = server.user_mgr.getuser(data.userid);
            if (user != undefined) {
                if (user.sign != "") {
                    var sign_data = server.fn.aes_decode(user.sign, server.CONST_SERVER.SERVER_KEY);
                    if (sign_data == undefined) {
                        server.log("ERR");
                        return;
                    }
                    //server.log(now - sign_data.time);
                    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
                        user.sign = server.fn.aes_encode({ userid: data.userid, time: now }, server.CONST_SERVER.SERVER_KEY);
                    }
                    else {
                        if (user.sign != body.sign) {
                            var ret = {
                                "status": "fail",  //succ or fail
                                "errmsg": ERR_MSG.NO_LOGIN
                            };
                            server.log(ret);
                            res.send(ret);
                            return;
                        }
                    }
                }
                else {
                    user.sign = server.fn.aes_encode({ userid: data.userid, time: now }, server.CONST_SERVER.SERVER_KEY);
                }
            }
            else {
                var sign = server.fn.aes_encode({ userid: data.userid, time: now }, server.CONST_SERVER.SERVER_KEY);
                user = new user_class({ userid: data.userid, sign: sign });
                server.user_mgr.push(user);
            }

            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "userid": data.userid,
                "head": data.head,
                "gold": data.gold,
                "name": data.name,
                "sign": user.sign
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg, //提示
                "userid": 0,
                "head": "",
                "gold": 0,
                "name": "",
                "sign": ""
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.picicodehandle = function (req, res) {
    server.log("recv msg picicode");
    var body = req.body;
    server.log(body);
    var _msg = {};
    server.web_mgr.picicode(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "pic": data.pic,
                "flag": data.flag
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.registerhandle = function (req, res) {
    server.log("recv msg register");
    var body = req.body;

    server.log(body);

    var _msg = {
        acc: body.acc, //账号
        pwd: body.pwd, //密码
        para: body.para,//介绍人
        mail: body.mail, //邮箱
        flag: body.flag, //标识
        icode: body.icode, //验证码
        ip: res.socket.remoteAddress
    };
    server.web_mgr.register(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "" //提示
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.hallhandle = function (req, res) {
    server.log("recv msg hall");
    var body = req.body;

    server.log(body);
    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    var _msg = { userid: sign_data.userid };
    server.web_mgr.hall(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }

        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "userid": data.userid,
                "head": data.head,
                "gold": data.gold,
                "name": data.name,
                "spread": data.spread
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg, //提示
                "userid": 0,
                "head": "",
                "gold": 0,
                "name": "",
                "spread": ""
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.selfinformationhandle = function (req, res) {
    server.log("recv msg selfinformation");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    var _msg = { userid: sign_data.userid };
    server.web_mgr.selfinformation(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "userid": data.userid,
                "head": data.head,
                "gold": data.gold,
                "name": data.name,
                "qrcode": data.qrcode,
                "spread": data.spread
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg, //提示
                "userid": 0,
                "head": "",
                "gold": 0,
                "name": "",
                "qrcode": "",
                "spread": ""
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.modifynamehandle = function (req, res) {
    server.log("recv msg modifyname");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    var _msg = { userid: sign_data.userid, newname: body.newname };
    server.web_mgr.modifyname(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "newname": body.newname
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg, //提示
                "newname": ""
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.modifypwdhandle = function (req, res) {
    server.log("recv msg modifypwd");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    var _msg = { userid: sign_data.userid, oldpwd: body.oldpwd, newpwd: body.newpwd };
    server.web_mgr.modifypwd(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "" //提示
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.transfergoldhandle = function (req, res) {
    server.log("recv msg transfergold");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    var _msg = { userid1: sign_data.userid, userid2: body.userid, gold: body.gold, pwd: body.pwd };
    server.web_mgr.transfergold(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "" //提示
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.transferrecordhandle = function (req, res) {
    server.log("recv msg transferrecord");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    var _msg = { userid: sign_data.userid };
    server.web_mgr.transferrecord(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {

            var records = [];
            for (var i = 0; i < data.records.length; i++) {
                var o = {
                    "time": data.records[i].time,
                    "userid": data.records[i].userid,
                    "gold": data.records[i].gold,
                    "balance": data.records[i].balance
                };
                records.push(o);
            }

            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "records": records
            };
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg, //提示
                "records": []
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.bankhandle = function (req, res) {
    server.log("recv msg bank");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    var _msg = { userid: sign_data.userid };
    server.web_mgr.bank(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {

            var ret = {
                "status": "succ",
                "errmsg": "",
                "paysum": data.paysum,
                "cashsum": data.cashsum,
                "bankcard": data.bankcard,
                "cards": []
            };

            if (data.bankcard == 1) {
                for (var i = 0; i < data.cards.length; i++) {
                    var o = {
                        "banktype": data.cards[i].banktype,
                        "cardnum": data.cards[i].cardnum,
                        "cardtype": data.cards[i].cardtype
                    };
                    ret.cards.push(o);
                }
            }
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.bandingbankcardhandle = function (req, res) {
    server.log("recv msg bandingbankcard");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    var _msg = {
        userid: sign_data.userid,
        username: body.username,
        cardnum: body.cardnum,
        bankname: body.bankname,
        province: body.province,
        city: body.city,
        subbranch: body.subbranch
    };
    server.web_mgr.bandingbankcard(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {

            var ret = {
                "status": "succ",
                "errmsg": ""
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.safeboxhandle = function (req, res) {
    server.log("recv msg safebox");
    var body = req.body;
    server.log(body);
    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }
    var _msg = { userid: sign_data.userid, pwd: body.pwd };
    server.web_mgr.safebox(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "",
                "paysum": data.paysum,
                "boxsum": data.boxsum,
                "totalsum": data.totalsum,
                "minsum": data.minsum
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.safeboxstorehandle = function (req, res) {
    server.log("recv msg safeboxstore");
    var body = req.body;
    server.log(body);
    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }
    var _msg = { userid: sign_data.userid, pwd: body.pwd, sum: body.sum };
    server.web_mgr.safeboxstore(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": "",
                "paysum": data.paysum,
                "boxsum": data.boxsum,
                "totalsum": data.totalsum
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.safeboxdrawouthandle = function (req, res) {
    server.log("recv msg safeboxdrawout");
    var body = req.body;
    server.log(body);
    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }
    var _msg = { userid: sign_data.userid, pwd: body.pwd, sum: body.sum };
    server.web_mgr.safeboxdrawout(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": "",
                "paysum": data.paysum,
                "boxsum": data.boxsum,
                "totalsum": data.totalsum
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.rechargedetailhandle = function (req, res) {
    server.log("recv msg rechargedetail");
    var body = req.body;
    server.log(body);
    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }
    var _msg = { userid: sign_data.userid };
    server.web_mgr.rechargedetail(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": "",
                "details": [] //时间 行为 状态 分数
            };
            for (var i = 0; i < data.details.length; i++) {
                var o = {
                    time: data.details[i].time,
                    action: data.details[i].action,
                    status: data.details[i].status,
                    gold: data.details[i].gold
                };
                ret.details.push(o);
            }
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.withdrawcashhandle = function (req, res) {
    server.log("recv msg withdrawcash");
    var body = req.body;
    server.log(body);
    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }
    var _msg = { userid: sign_data.userid, sum: body.sum };
    server.web_mgr.withdrawcash(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": ""
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.phonebetdatahandle = function (req, res) {
    server.log("recv msg phonebetdata");
    var body = req.body;
    server.log(body);
    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }
    var _msg = { userid: sign_data.userid };
    server.web_mgr.phonebetdata(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": data.errmsg,
                "isbet": data.isbet,
                "configs": []
            };

            for (var i = 0; i < data.configs.length; i++) {
                var o = {
                    "index": data.configs[i].index,
                    "text": data.configs[i].text
                };
                ret.configs.push(o);
            }

            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.phonebethandle = function (req, res) {
    server.log("recv msg phonebet");
    var body = req.body;
    server.log(body);
    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }
    var _msg = {
        userid: sign_data.userid,
        telephone: body.telephone,
        score: body.score,
        index: body.index
    };
    server.web_mgr.phonebet(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": ""
            };

            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.quitgamehandle = function (req, res) {
    server.log("recv msg quitgame");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var user = server.user_mgr.getuser(sign_data.userid);
    if (user != undefined) {
        if (user.sign == body.sign) {
            user.sign = "";
        }
    }

    var ret = {
        "status": "succ",  //succ or fail
        "errmsg": ""
    };
    res.send(ret);
};

client_mgr.prototype.noticehandle = function (req, res) {
    server.log("recv msg notice");
    var body = req.body;
    server.log(body);
    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }
    server.web_mgr.notice({}, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE,
                "data": []
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": "",
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg,
                "data": []
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.checkqrcodehandle = function (req, res) {
    server.log("recv msg checkqrcode");
    var body = req.body;
    server.log(body);
    server.web_mgr.checkqrcode(body, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": ""
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.modifytwopwdhandle = function (req, res) {
    server.log("recv msg modifypwd");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    var _msg = { userid: sign_data.userid, oldpwd: body.oldpwd, newpwd: body.newpwd };
    server.web_mgr.modifytwopwd(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "" //提示
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.rechargectlhandle = function (req, res) {
    server.log("recv msg rechargectl");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.rechargectl({}, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": "",
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",
                "errmsg": data.errmsg
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.syncgoldhandle = function (req, res) {
    //server.log("recv msg syncgold");
    var body = req.body;
    //server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        //server.log("ERR");
        return;
    }
    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        //server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        //server.log("ERR");
        return;
    }

    var _msg = { userid: sign_data.userid };
    server.web_mgr.selfinformation(_msg, function (data) {
        //server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            //server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",
                "errmsg": "",
                "gold": data.gold
            };
            //server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg,
                "gold": 0
            };
            //server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.getbackpwdhandle = function (req, res) {
    server.log("recv msg getbackpwd");
    var body = req.body;
    server.log(body);
    var _msg = {
        acc: body.acc,        
        question: body.question,
        answer: body.answer,
        newpwd: body.newpwd
    };
    server.web_mgr.getbackpwd(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "" //提示
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.getbacktwopwdhandle = function (req, res) {
    server.log("recv msg getbacktwopwd");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    var _msg = {
        userid: sign_data.userid,
        question: body.question,
        answer: body.answer,
        newpwd: body.newpwd
    };
    server.web_mgr.getbacktwopwd(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "" //提示
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.roomcheckhandle = function (req, res) {
    server.log("recv msg roomcheck");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.roomcheck({ userid: sign_data.userid, roomtype: body.roomtype }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "" //提示
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.getspreadconfhandle = function (req, res) {
    server.log("recv msg getspreadconfhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.getspreadconf({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.userspreadhandle = function (req, res) {
    server.log("recv msg userspreadhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.userspread({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.receivespreadhandle = function (req, res) {
    server.log("recv msg receivespreadhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.receivespread({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.spreadtotalnumberhandle = function (req, res) {
    server.log("recv msg spreadtotalnumberhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.spreadtotalnumber({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.spreadtodaynumberhandle = function (req, res) {
    server.log("recv msg spreadtodaynumberhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.spreadtodaynumber({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.yesterdayprofithandle = function (req, res) {
    server.log("recv msg yesterdayprofithandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.yesterdayprofit({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.todayprofithandle = function (req, res) {
    server.log("recv msg todayprofithandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.todayprofit({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.weekprofithandle = function (req, res) {
    server.log("recv msg weekprofithandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.weekprofit({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.lastweekprofithandle = function (req, res) {
    server.log("recv msg lastweekprofithandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.lastweekprofit({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.monthprofithandle = function (req, res) {
    server.log("recv msg monthprofithandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.monthprofit({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.subdetailedhandle = function (req, res) {
    server.log("recv msg subdetailedhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.subdetailed({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.footballurlhandle = function (req, res) {
    server.log("recv msg footballurlhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.footballurl({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.isbindsecurityhandle = function (req, res) {
    server.log("recv msg isbindsecurityhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.isbindsecurity({ userid: sign_data.userid }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "isbind": data.status
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.bindsecurityhandle = function (req, res) {
    server.log("recv msg bindsecurityhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.bindsecurity({ userid: sign_data.userid, question: body.question, answer: body.answer }, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "" //提示
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.getactivityhandle = function (req, res) {
    server.log("recv msg getactivityhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.getactivity({}, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.getcarouselhandle = function (req, res) {
    server.log("recv msg getcarouselhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.getcarousel({}, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.getguidehandle = function (req, res) {
    server.log("recv msg getguidehandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    server.web_mgr.getguide({}, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};

client_mgr.prototype.getdetailedhandle = function (req, res) {
    server.log("recv msg getdetailedhandle");
    var body = req.body;
    server.log(body);

    var sign_data = server.fn.aes_decode(body.sign, server.CONST_SERVER.SERVER_KEY);
    if (sign_data == undefined) {
        server.log("ERR");
        return;
    }

    var now = Date.now();
    if ((now - sign_data.time) > server.CONST_SERVER.CLIENT_SIGN_EXPIRE) {
        var ret = {
            "status": "expire",  //succ or fail
            "errmsg": ERR_MSG.SIGN_EXPIRE
        };
        server.log(ret);
        res.send(ret);
        return;
    }

    if (sign_data.userid == undefined) {
        server.log("ERR");
        return;
    }

    var _msg = {
        token: body.token,
        startDate: body.startDate,
        endDate: body.endDate,
        boots: body.boots,
        games: body.games,
        hallType: body.hallType
    };

    server.web_mgr.getdetailed(_msg, function (data) {
        server.log(data);
        if (data == undefined) {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": ERR_MSG.SERVER_CLOSE
            };
            server.log(ret);
            res.send(ret);
            return;
        }
        if (data.code == 0) {
            var ret = {
                "status": "succ",  //succ or fail
                "errmsg": "", //提示
                "data": data.data,
                "count": data.count,
                "pageSize": data.pageSize,
                "page":data.page
            };
            server.log(ret);
            res.send(ret);
        }
        else {
            var ret = {
                "status": "fail",  //succ or fail
                "errmsg": data.errmsg //提示
            };
            server.log(ret);
            res.send(ret);
        }
    });
};


module.exports = new client_mgr();

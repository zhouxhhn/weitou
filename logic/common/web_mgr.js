
var db = server.db.game;
var t_user = server.CONST_SERVER.USER_DB;
var ERROR_CODE = server.CONST_SERVER.ERROR_CODE;
var WS_MSG = server.CONST_SERVER.WS_MSG;
var SW_MSG = server.CONST_SERVER.SW_MSG;
var CS_MSG = server.CONST_SERVER.CS_MSG;
var SC_MSG = server.CONST_SERVER.SC_MSG;

function web_mgr() {

    this.s = null;

    this._cbid = 0;
    this.__defineGetter__("cbid", function () {
        this._cbid++;
        if (this._cbid > 1000000) this._cbid = 0;
        return this._cbid;
    });

    this.cb_list = {};

    this.roles = {};
    this.rooms = { 1: [], 2: [], 3: [] };
};

web_mgr.prototype.prepare = function (cb) {
    server.log("do web_mgr prepare");
    cb();
};

web_mgr.prototype.stop = function (cb) {
    server.log("do web_mgr stop");
    cb();
};

web_mgr.prototype.enterroom = function (type, userid) {
    userid = Number(userid);
    if (this.rooms[type].indexOf(userid) == -1) {
        this.rooms[type].push(userid);
    }
};

web_mgr.prototype.leaveroom = function (type, userid) {
    userid = Number(userid);
    var index = this.rooms[type].indexOf(userid);
    if (index != -1) {
        this.rooms[type].splice(index, 1);
    }
};

web_mgr.prototype.send = function (msgid, msg) {
    if (this.s !== null) {
        this.s.send(msgid, msg);
    }
    else {
        server.log(server.CONST_SERVER.LOG_WEBMSG, "msg : %j ", msg);
    }
};

web_mgr.prototype.updaterolestate = function () {
    //
};

web_mgr.prototype.webrpc = function (msgid, _msg, cb) {
    if (this.s !== null) {
        var nowtime = new Date().getTime();
        var cbid = this.cbid;
        var data = {
            cbid: cbid,
            time: nowtime,
            cb: cb
        };
        this.cb_list[cbid] = data;

        _msg.cbid = cbid;
        //server.log(_msg);
        this.s.send(msgid, _msg);
    }
    else {
        cb(undefined);
    }
};

web_mgr.prototype.handlewebrpc = function (msg) {
    //server.log(msg);
    var cbid = msg.cbid;
    var data = this.cb_list[cbid];
    if (data != undefined) {
        if (!!data.cb && typeof data.cb == "function") {
            //server.log(msg);
            data.cb(msg);
        }
        delete this.cb_list[cbid];
    }
};

web_mgr.prototype.login = function (msg, cb) {
    var _msg = {
        acc: msg.acc,
        password: msg.password
    };
    this.webrpc(SW_MSG.LOGIN, _msg, cb);
};

web_mgr.prototype.picicode = function (msg, cb) {
    var _msg = {};
    server.log(_msg);
    this.webrpc(SW_MSG.PICICODE, _msg, cb);
};

web_mgr.prototype.register = function (msg, cb) {
    var _msg = {
        acc: msg.acc,
        pwd: msg.pwd,
        para: msg.para,
        mail: msg.mail,
        flag: msg.flag,
        icode: msg.icode,
        ip: msg.ip
    };
    server.log(_msg);
    this.webrpc(SW_MSG.REGISTER, _msg, cb);
};

web_mgr.prototype.hall = function (msg, cb) {
    var _msg = {
        userid: msg.userid
    };
    this.webrpc(SW_MSG.SELFINFORMATION, _msg, cb);
};

web_mgr.prototype.selfinformation = function (msg, cb) {
    var _msg = {
        userid: msg.userid
    };
    this.webrpc(SW_MSG.SELFINFORMATION, _msg, cb);
};

web_mgr.prototype.modifyname = function (msg, cb) {
    var _msg = {
        userid: msg.userid,
        newname: msg.newname
    };
    this.webrpc(SW_MSG.MODIFYNAME, _msg, cb);
};

web_mgr.prototype.modifypwd = function (msg, cb) {
    server.log(msg);
    var _msg = {
        userid: msg.userid,
        oldpwd: msg.oldpwd,
        newpwd: msg.newpwd
    };
    this.webrpc(SW_MSG.MODIFYPWD, _msg, cb);
};

web_mgr.prototype.getbackpwd = function (msg, cb) {
    server.log(msg);
    var _msg = {
        acc: msg.acc,
        question: msg.question,
        answer: msg.answer,
        newpwd: msg.newpwd
    };
    this.webrpc(SW_MSG.FINDPASSWORD, _msg, cb);
};

web_mgr.prototype.modifytwopwd = function (msg, cb) {
    server.log(msg);
    var _msg = {
        userid: msg.userid,
        oldpwd: msg.oldpwd,
        newpwd: msg.newpwd
    };
    this.webrpc(SW_MSG.MODIFYTWOPWD, _msg, cb);
};

web_mgr.prototype.getbacktwopwd = function (msg, cb) {
    server.log(msg);
    var _msg = {
        userid: msg.userid,
        question: msg.question,
        answer: msg.answer,
        newpwd: msg.newpwd
    };
    this.webrpc(SW_MSG.FINDTWOPWD, _msg, cb);
};

web_mgr.prototype.transfergold = function (msg, cb) {
    var _msg = {
        userid1: msg.userid1,
        userid2: msg.userid2,
        gold: msg.gold,
        pwd: msg.pwd
    };
    this.webrpc(SW_MSG.TRANSFERGOLD, _msg, cb);
};

web_mgr.prototype.transferrecord = function (msg, cb) {
    var _msg = {
        userid: msg.userid
    };
    this.webrpc(SW_MSG.TRANSFERRECORD, _msg, cb);
};

web_mgr.prototype.bank = function (msg, cb) {
    var _msg = {
        userid: msg.userid
    };
    this.webrpc(SW_MSG.BANK, _msg, cb);
};

web_mgr.prototype.bandingbankcard = function (msg, cb) {
    var _msg = {
        userid: msg.userid,
        username: msg.username,
        cardnum: msg.cardnum,
        bankname: msg.bankname,
        province: msg.province,
        city: msg.city,
        subbranch: msg.subbranch
    };
    this.webrpc(SW_MSG.BANDINGBANKCARD, _msg, cb);
};

web_mgr.prototype.safebox = function (msg, cb) {
    var _msg = {
        userid: msg.userid,
        pwd: msg.pwd
    };
    this.webrpc(SW_MSG.SAFEBOX, _msg, cb);
};

web_mgr.prototype.safeboxstore = function (msg, cb) {
    var _msg = {
        userid: msg.userid,
        pwd: "",
        sum: msg.sum
    };
    this.webrpc(SW_MSG.SAFEBOXSTORE, _msg, cb);
};

web_mgr.prototype.safeboxdrawout = function (msg, cb) {
    var _msg = {
        userid: msg.userid,
        pwd: "",
        sum: msg.sum
    };
    this.webrpc(SW_MSG.SAFEBOXDRAWOUT, _msg, cb);
};

web_mgr.prototype.rechargedetail = function (msg, cb) {
    var _msg = {
        userid: msg.userid
    };
    this.webrpc(SW_MSG.RECHARGEDETAIL, _msg, cb);
};

web_mgr.prototype.withdrawcash = function (msg, cb) {
    var _msg = {
        userid: msg.userid,
        bankcard: "",
        sum: msg.sum
    };
    this.webrpc(SW_MSG.WITHDRAWCASH, _msg, cb);
};

web_mgr.prototype.phonebetdata = function (msg, cb) {
    var _msg = {
        userid: msg.userid
    };
    this.webrpc(SW_MSG.PHONEBETDATA, _msg, cb);
};

web_mgr.prototype.phonebet = function (msg, cb) {
    var _msg = {
        userid: msg.userid,
        telephone: msg.telephone,
        score: msg.score,
        index: msg.index
    };
    this.webrpc(SW_MSG.PHONEBET, _msg, cb);
};

web_mgr.prototype.chat = function (msg, cb) {
    var _msg = {
        "roomtype": msg.roomtype,
        "userid": msg.userid,
        "texttype": msg.texttype,
        "text": msg.text
    };
    this.webrpc(SW_MSG.CHAT, _msg, cb);
};

web_mgr.prototype.chatbroadcast = function (msg) {
    server.log(msg);

    var _msg = {
        "roomtype": msg.roomtype,
        "userid": msg.userid,     
        "name": msg.name,
        "head": msg.head,
        "index": msg.index,
        "texttype": msg.texttype,
        "text": msg.text,
        "time": msg.time
    };

    var arr = this.rooms[msg.roomtype];
    if (arr != undefined) {
        for (var i = 0; i < arr.length; i++) {
            var userid = arr[i];
            if (this.roles[userid] != undefined) {
                if (this.roles[userid].s !== null) {
                    server.log(_msg);
                    this.roles[userid].s.send(SC_MSG.CHATBROADCAST, _msg);
                    //server.log(_msg);
                }
            }
        }
    }
};

web_mgr.prototype.chatrecord = function (msg, cb) {
    var _msg = {
        "roomtype": msg.roomtype,
        "index": msg.index,
        "gettype": msg.gettype,
        "count": msg.count
    };
    this.webrpc(SW_MSG.CHATRECORD, _msg, cb);
};

web_mgr.prototype.datatable = function (msg, cb) {
    var _msg = {
        "userid": msg.userid,
        "roomtype": msg.roomtype,
        "index": msg.index
    };
    this.webrpc(SW_MSG.DATATABLE, _msg, cb);
};

web_mgr.prototype.notice = function (msg, cb) {
    var _msg = {};
    this.webrpc(SW_MSG.NOTICE, _msg, cb);
};

web_mgr.prototype.checkqrcode = function (msg, cb) {
    var _msg = { para: msg.para };
    this.webrpc(SW_MSG.CHECKQRCODE, _msg, cb);
};

web_mgr.prototype.rechargectl = function (msg, cb) {
    var _msg = {};
    this.webrpc(SW_MSG.RECHARGECTL, _msg, cb);
};

web_mgr.prototype.roomcheck = function (msg, cb) {
    var _msg = { roomtype: msg.roomtype, userid: msg.userid };
    this.webrpc(SW_MSG.ROOMCHECK, _msg, cb);
};

web_mgr.prototype.runalottery = function (msg) {
    server.log(msg);

    var arr = msg.data;
    for (var i = 0; i < arr.length; i++) {
        var userid = arr[i].userid;
        if (this.roles[userid] != undefined) {
            if (this.roles[userid].s !== null) {
                var _msg = {
                    "status": "succ",
                    "errmsg": "",
                    "gold": arr[i].gold
                };
                server.log(_msg);
                this.roles[userid].s.send(SC_MSG.SYNCGOLD, _msg);
            }
        }
    }
};

web_mgr.prototype.viewplayer = function (msg, cb) {
    var _msg = { roomtype: msg.roomtype, data: msg.arr };
    this.webrpc(SW_MSG.PLAYERLIST, _msg, cb);
};

web_mgr.prototype.kickplayer = function (msg) {
    server.log(msg);
    var roomtype = msg.roomtype;
    var _msg = {
        "status": "succ",
        "errmsg": "",
        "roomtype": roomtype
    };
    var arr = this.rooms[msg.roomtype];
    if (arr != undefined) {
        for (var i = 0; i < arr.length; i++) {
            var userid = arr[i];
            if (this.roles[userid] != undefined) {
                if (this.roles[userid].s !== null) {
                    server.log("notify " + userid + " server close .");
                    this.roles[userid].s.send(SC_MSG.ROOMCLOSE, _msg);
                    this.roles[userid].s.destroy();
                }
            }
        }
    }
};

web_mgr.prototype.getspreadconf = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.GETSPREAD, _msg, cb);
};

web_mgr.prototype.userspread = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.USERSPREAD, _msg, cb);
};

web_mgr.prototype.receivespread = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.RECEIVE, _msg, cb);
};

web_mgr.prototype.spreadtotalnumber = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.TOTALSUM, _msg, cb);
};

web_mgr.prototype.spreadtodaynumber = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.TODAYSUM, _msg, cb);
};

web_mgr.prototype.yesterdayprofit = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.YESTERDAYPROFIT, _msg, cb);
};

web_mgr.prototype.todayprofit = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.TODAYPROFIT, _msg, cb);
};

web_mgr.prototype.weekprofit = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.WEEKPROFIT, _msg, cb);
};

web_mgr.prototype.lastweekprofit = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.LASTWEEKPROFIT, _msg, cb);
};

web_mgr.prototype.monthprofit = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.MONTHPROFIT, _msg, cb);
};

web_mgr.prototype.subdetailed = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.SUBDETAILED, _msg, cb);
};

web_mgr.prototype.footballurl = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.FOOTBALLURL, _msg, cb);
};

web_mgr.prototype.isbindsecurity = function (msg, cb) {
    var _msg = { userid: msg.userid };
    this.webrpc(SW_MSG.ISBINDSECURITY, _msg, cb);
};

web_mgr.prototype.bindsecurity = function (msg, cb) {
    var _msg = { userid: msg.userid, question: msg.question, answer: msg.answer };
    this.webrpc(SW_MSG.BINDSECURITY, _msg, cb);
};

web_mgr.prototype.getactivity = function (msg, cb) {
    var _msg = {};
    this.webrpc(SW_MSG.GETACTIVITY, _msg, cb);
};

web_mgr.prototype.getcarousel = function (msg, cb) {
    var _msg = {};
    this.webrpc(SW_MSG.GETCAROUSEL, _msg, cb);
};

web_mgr.prototype.getguide = function (msg, cb) {
    var _msg = {};
    this.webrpc(SW_MSG.GETGUIDE, _msg, cb);
};

web_mgr.prototype.getdetailed = function (msg, cb) {
    var _msg = {};
    this.webrpc(SW_MSG.GETDETAILED, _msg, cb);
};

module.exports = new web_mgr();


var handler = module.exports;
var SYS_MSG = server.CONST.SYS_MSG;
var WS_MSG = server.CONST_SERVER.WS_MSG;
var SW_MSG = server.CONST_SERVER.SW_MSG;
var COMMON_NOTCHECK = server.CONST_SERVER.COMMON_NOTCHECK;

handler[SYS_MSG.COMMON] = function (msgid, msg, s) {
    return false;
};

handler[SYS_MSG.CONNECT] = function (msg, s) {
    server.log("server connected. " + s.remoteAddress + "   " + s.remotePort);
    server.web_mgr.s = s;
};

handler[SYS_MSG.CLOSE] = function (msg, s) {
    server.log("server closed. " + s.remoteAddress);
    server.web_mgr.s = null;
};

handler[WS_MSG.LOGIN] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.REGISTER] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.SELFINFORMATION] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.MODIFYNAME] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.MODIFYPWD] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.FINDPASSWORD] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.FINDTWOPWD] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.PLAYERLIST] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.MODIFYTWOPWD] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.TRANSFERGOLD] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.TRANSFERRECORD] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.BANK] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.BANDINGBANKCARD] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.SAFEBOX] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.SAFEBOXSTORE] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.SAFEBOXDRAWOUT] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.RECHARGEDETAIL] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.WITHDRAWCASH] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.PHONEBETDATA] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.PHONEBET] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.CHAT] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.CHATBROADCAST] = function (msg, s) {
    server.web_mgr.chatbroadcast(msg);
};

handler[WS_MSG.CHATRECORD] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.DATATABLE] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.NOTICE] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.CHECKQRCODE] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.RECHARGECTL] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.PUSHGOLD] = function (msg, s) {
    server.web_mgr.runalottery(msg);
};

handler[WS_MSG.ROOMCHECK] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.KICKPLAYER] = function (msg, s) {
    server.web_mgr.kickplayer(msg);
};

handler[WS_MSG.GETSPREAD] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.USERSPREAD] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.RECEIVE] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.TOTALSUM] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.TODAYSUM] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.YESTERDAYPROFIT] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.TODAYPROFIT] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.WEEKPROFIT] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.LASTWEEKPROFIT] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.MONTHPROFIT] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.SUBDETAILED] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.FOOTBALLURL] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.PICICODE] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.ISBINDSECURITY] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.BINDSECURITY] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.GETACTIVITY] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.GETCAROUSEL] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.GETGUIDE] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

handler[WS_MSG.GETDETAILED] = function (msg, s) {
    server.web_mgr.handlewebrpc(msg);
};

var db = server.db.game;
var t_user = server.CONST_SERVER.USER_DB;
var ERR_MSG = server.CONST_SERVER.ERR_MSG;

function user_mgr() {
    this.cache = {};
};

user_mgr.prototype.prepare = function (cb) {
    server.log("do user_mgr prepare");
    cb();
};

user_mgr.prototype.stop = function (cb) {
    server.log("do user_mgr stop");
    cb();
};

user_mgr.prototype.getuser = function (uid, cb) {
    return this.cache[uid];
};

user_mgr.prototype.push = function (user) {
    this.cache[user.userid] = user;
};

user_mgr.prototype.login = function (uid, sign) {

};

user_mgr.prototype.logout = function (uid) {

};

module.exports = new user_mgr();

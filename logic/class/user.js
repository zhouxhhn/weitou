
var db = server.db.game;
var t_user = server.CONST_SERVER.USER_DB;

var user = function (opts) {
    this.userid = opts.userid || 0;
    this.sign = opts.sign || "";
};

module.exports = user;

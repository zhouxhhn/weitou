
//export some useful functions

//copy src obj propertys to dst obj
exports.extend = function (dst, src, delete_flag) {

    delete_flag = delete_flag === undefined ? false : !!delete_flag;
    //delete first
    if (delete_flag) {
        for (var key in dst) {
            if (src[key] === undefined) {
                delete dst[key];
            }
        }
    }
    //copy
    for (var _key in src) {
        if (src[_key] !== undefined) {
            dst[_key] = src[_key];
        }
    }
};

exports.isEmpty = function (str) {
    return str == undefined || str == null || str == "";
};

//for crypto
var crypto = require("crypto");

exports.aes_encode = function (obj, key) {

    var str = JSON.stringify(obj);
    var cipher = crypto.createCipher("aes128", key);
    var str1 = cipher.update(str, "utf8", "base64");
    var str2 = cipher.final("base64");

    return str1 + str2;
};

exports.aes_encode2 = function (bufpara, key, iv) {
    //var str = JSON.stringify(obj);
    var len = bufpara.length;
    server.log("encode buffer **********");
    server.log(bufpara);
    server.log(len);
    var divisor = Math.floor(len / 16);
    var remainder = len % 16;
    var data;
    //server.log(remainder);
    //if == 0, do nothing
    if (remainder != 0) {
        var newlen = (divisor + 1) * 16;
        var buf = new Buffer(newlen);
        var offset;
        for (offset = 0; offset < len; offset++) {
            buf[offset] = bufpara[offset];
        }
        //server.log(offset)
        for (i = offset; i < newlen; i++) {
            buf[i] = 0x00;
        }
        data = buf;
    }
    else {
        data = bufpara;
    }

    server.log("fill encode buffer **********");
    server.log(data);
    server.log(data.length);
    var cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    cipher.setAutoPadding(false);
    var buf1 = cipher.update(data);
    var buf2 = cipher.final();
    server.log(buf1.length);
    server.log(buf2.length);
    var ret = new Buffer(buf1.length + buf2.length);
    buf1.copy(ret);
    buf2.copy(ret, buf1.length);

    server.log("get encode buffer **********");
    server.log(ret);
    server.log(ret.length);

    return ret;
};

exports.aes_decode2 = function (buf, key, iv) {

    server.log("decode buffer **********");
    server.log(buf);
    server.log(buf.length);
    var decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    decipher.setAutoPadding(false);
    var buf1 = decipher.update(buf);
    var buf2 = decipher.final();
    //merge buf
    var data = new Buffer(buf1.length + buf2.length);
    buf1.copy(data);
    buf2.copy(data, buf1.length);

    server.log("get decode buffer **********");
    server.log(data);
    server.log(data.length);
    var len = 0;
    for (var i = data.length - 1; i >= 0; i--) {
        len = i;
        if (data[i] != 0x00) {
            break;
        }
        //len++;
    }
    /*
    for (var i = 0; i < data.length; i++) {
        if (data[i] == 0) {
            break;
        }
        len++;
    }
    */
    //server.log(len);
    var ret = new Buffer(len + 1);
    for (var i = 0; i <= len; i++) {
        ret[i] = data[i];
    }

    server.log("hanle decode buffer **********");
    server.log(ret);
    server.log(ret.length);

    return ret;
};

exports.aes_encode3 = function (str, key, iv) {
    //var str = JSON.stringify(obj);
    var len = Buffer.byteLength(str);
    server.log(len);
    var divisor = Math.floor(len / 16);
    var remainder = len % 16;
    var buf;
    //if == 0, do nothing
    if (remainder != 0) {
        var newlen = (divisor + 1) * 16;
        buf = new Buffer(newlen);
        var offset = buf.write(str);
        for (; offset < buf.length; offset++) {
            buf[offset] = 0;
        }
    }
    else {
        buf = str;
    }
    server.log(buf.length);
    var cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    cipher.setAutoPadding(false);
    var str1 = cipher.update(buf, "utf8", "base64");
    var str2 = cipher.final("base64");
    return str1 + str2;
};

exports.aes_decode = function (str, key) {

    var decipher = crypto.createDecipher("aes128", key);
    var obj;
    try {
        var str1 = decipher.update(str, "base64", "utf8");
        var str2 = decipher.final("utf8");
        obj = JSON.parse(str1 + str2);
    }
    catch (e) {
        obj = undefined;
    }

    //outer need check undefined
    return obj;
};

exports.des_encode = function (obj, key) {

    var str = JSON.stringify(obj);
    var cipher = crypto.createCipher("DES-EDE", key);
    var str1 = cipher.update(str, "utf8", "base64");
    var str2 = cipher.final("base64");

    return str1 + str2;
};

exports.des_decode = function (str, key) {

    var decipher = crypto.createDecipher("des-ede", key);
    var obj;
    try {
        var str1 = decipher.update(str, "base64", "utf8");
        var str2 = decipher.final("utf8");
        obj = JSON.parse(str1 + str2);
    }
    catch (e) {
        obj = undefined;
    }

    //outer need check undefined
    return obj;
};

exports.get_md5_str = function (str) {
    if (str) {
        return crypto.createHash("md5").update(str,"utf8").digest("hex");
    }
    else {
        return undefined;
    }
};

//arr : array or obj
//fname : function name or function
exports.async = function (arr, fname, cb) {

    var total, origin;
    if (arr instanceof Array) {
        total = arr.length;
    }
    else {
        origin = arr;
        arr = Object.keys(origin);
        total = arr.length;
    }

    if (total === 0) {
        cb();
        return;
    }

    function done() {
        if (--total === 0) {
            cb();
        }
    }

    function create_done() {
        return function () {
            if (!arguments.callee.called) {
                arguments.callee.called = true;
                if (--total === 0) {
                    cb();
                }
            }
            else {
                server.log(new Error("callback is already be called."));
            }
        }
    }

    //get param
    var args = Array.prototype.slice.call(arguments, 3);
    var len = args.length;
    //set cb
    args.concat(undefined);


    for (var i = 0; i < arr.length; i++) {
        var obj = origin === undefined ? arr[i] : origin[arr[i]];
        if (obj) {

            if (typeof fname === "function") {
                fname(obj, done);
            }
            else {
                if (typeof obj[fname] === "function") {
                    if (obj[fname].length > 0) {
                        args[len] = create_done();
                        obj[fname].apply(obj, args);
                    }
                    else {
                        obj[fname]();
                        done();
                    }
                }
                else {
                    done();
                }
            }
        }
        else {
            done();
        }
    }
};

//url encode for "()"
exports.url_encode = function (str) {
    var ret = encodeURIComponent(str).replace(/\(/g, "%28").replace(/\)/g, "%29");
    //convert space to plus(+)
    ret = ret.replace(/%20/g, '+');
    return ret;
};

//get beijing time
exports.getChinaTime = function() {
	
	var date = new Date();
	var utc = Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),date.getUTCHours(),
						date.getUTCMinutes(),date.getUTCSeconds(),date.getUTCMilliseconds());
	
	return utc + 28800000;
}

//for xml
var util = require("util");
var xml2js = require("express-xml-bodyparser/node_modules/xml2js");

exports.xml2obj = function(str,options){
	var op = util._extend({
			async: false,
			explicitArray: false,
			normalize: false,
			normalizeTags: false,
			trim: false
		}, options || {});
		
	var parser = new xml2js.Parser(op);	
	var ret;
	
	parser.parseString(str,function(err,result){
		if(!err)
			ret = result;
	})
	
	return ret;
}

exports.obj2xml = function(obj,options){
	var op = util._extend({
			rootName:"xml",
			cdata:true
		}, options || {});
		
	var builder = new xml2js.Builder(op);
	return builder.buildObject(obj);
}

//for files
var fs = require("fs");
var config = require("main/utils/config");

exports.readjson = function(path,cb){

    fs.readFile(path,"utf8",function(err,str){
        var data;
        if(!err)
        {
            try{
                data = JSON.parse(str);
            }catch(e){
                err = e;
            }
        }

        if(err)
        {
            server.log_err("read json %j err %j",path,err);
            cb();
        }
        else
        {
            cb(data);
        }
    });
};

//method 2 is :
//  var newstr = "obj=" + str;
//  var obj = eval(newstr);
exports.readextjson = function(path,cb){

    config.read(path,function(err,data){
        if(err)
        {
            server.log_err("read ext json %j err %j",path,err);
            cb();
        }
        else
        {
            cb(data);
        }
    });
};

exports.watchfile = function (path, cb){
    var watcher = fs.watch(path, function(event, filename){
        if(event === "change")
        {
            //must close it and restart ,otherwise will cause multi event
            watcher.close();
            exports.watchfile(path,cb);

            cb(path);
        }
    });
};

exports.checkmail = function (mail) {

    if (mail.length >= 3 && mail.length <= 24) {
        var pattern = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if (pattern.test(mail))
            return true;
    }
    return false;
};

exports.checkletter = function (para) {
    var pattern = /^[A-Za-z0-9]*$/;
    if (pattern.test(para)) {
        return true;
    }
    return false;
};

exports.invokecallback = function (cb) {
    if (!!cb && typeof cb == 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

//generate a random number between min and max
exports.rand = function (min, max) {
    var n = max - min;
    return min + Math.round(Math.random() * n);
};

//generate c random number between min(n) and max(x),include n and x, beside b
//result is Array
exports.getrandarr = function (x, n, c, b) {

    var r = [];
    if (c <= 0 || n > x) {
        return r;
    }
    if (c > (x - n)) {

    }
    var arr = [];
    for (var i = n; i <= x; i++) {
        if (b != undefined && i == b) continue;
        arr.push(i);
    }
    var k = 0;
    for (var j = 1; j <= c; j++) {
        var rand_num = Math.floor(Math.random() * (arr.length - k));
        r.push(arr[rand_num]);
        arr[rand_num] = arr[arr.length - k - 1];
        k++;
    }
    return r;
};

exports.disorder = function (a) {
    a.sort(function (v1, v2) {
        return 0.5 - Math.random();
    });
};

exports.istoday = function (mli) {
    var now = new Date();
    if (isNaN(mli)) {
        return false;
    }
    var t = new Date(mli);
    return (t.getFullYear() == now.getFullYear() && t.getMonth() ==
        now.getMonth() && t.getDate() == now.getDate());
};

//�ж�ʱ��ͽ�������
exports.diffdays = function (mil) {
    var now = new Date();
    var t = new Date(mil);

    var date1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var date2 = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    return Math.abs(date1 - date2) / 86400000;
};

exports.cardweight = function (para) {
    var value = para.value;
    if (value == 1) {
        value = 14;
    }
    var ret = (value * 10) + (4 - Number(para.color));

    var str = "";
    ret = "" + ret;
    if (ret < 100) {
        str = "0";
    }
    str = str + ret;
    return str;
};


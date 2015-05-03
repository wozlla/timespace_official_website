var mongodb = require("./db");
var ObjectId = require('mongodb').ObjectID;

function ContactUs(){
}


ContactUs.prototype.add = function(contactUsObj, callback) {
    var db = mongodb.createDb();
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    //todo use moment
    var time = {
        date: date,
        year : date.getFullYear(),
        month : date.getFullYear() + "." + (date.getMonth() + 1),
        day : date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate(),
        minute : date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
    };
    //要存入数据库的文档
    var contactUs = contactUsObj;
    contactUs.time = time.minute;

    //打开数据库
    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("contactUs", function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }

            collection.insert(contactUs, {
                safe: true
            }, function (err) {
                db.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null);//返回 err 为 null
            });
        });
    });
};

//读取文章及其相关信息
ContactUs.prototype.get = function(id, callback) {
    var db = mongodb.createDb();

    //打开数据库
    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("contactUs", function(err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            var query = {};
            if (id) {
                query._id = new ObjectId(id);
            }
            //根据 query 对象查询文章
            collection.findOne(query, function (err, docs) {
                db.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, docs);//成功！以数组形式返回查询的结果
            });
        });
    });
};

ContactUs.prototype.getList = function(pageNumber, pageSize, callback) {
    var db = mongodb.createDb();
    var skipCount = (pageNumber - 1) * pageSize,
        limitCount = pageSize;

    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("contactUs", function(err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }

            collection.count(function(err, count){
                var pageCount = Math.ceil(count / pageSize);

                collection.find().sort({
                    time: -1,
                    _id: -1
                }).skip(skipCount).limit(limitCount)
                    .toArray(function (err, docs) {
                        db.close();
                        if (err) {
                            return callback(err);//失败！返回 err
                        }
                        callback(null, docs, {
                            pageNumber: Number(pageNumber),
                            pageCount: Number(pageCount)
                        });//成功！以数组形式返回查询的结果
                    });
            });
        });
    });
};

ContactUs.prototype.remove = function(id, callback){
    var db = mongodb.createDb();

    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("contactUs", function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            var query = {};
            if (id) {
                query._id = new ObjectId(id);
            }

            collection.remove(query, null, function (err) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

module.exports = ContactUs;

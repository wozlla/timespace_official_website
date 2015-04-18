var mongodb = require("./db");
var ObjectId = require('mongodb').ObjectID;

function News(){
}

module.exports = News;

//存储一篇文章及其相关信息
News.prototype.add = function(newsObj, callback) {
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
    var news = newsObj;
    news.time = time.day;

    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("news", function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.insert(news, {
                safe: true
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null);//返回 err 为 null
            });
        });
    });
};

News.prototype.update = function(id, data, callback){
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("news", function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (id) {
                query._id = new ObjectId(id);
            }

            collection.update(query, {
                $set:data   //only set fields contained in data(e.g: not edit "time" field)
            }, null, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null);//返回 err 为 null
            });
        });
    });
};

News.prototype.remove = function(id, callback){
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("news", function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (id) {
                query._id = new ObjectId(id);
            }

            collection.remove(query, null, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

//读取文章及其相关信息
News.prototype.get = function(id, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("news", function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (id) {
                query._id = new ObjectId(id);
            }
            //根据 query 对象查询文章
            collection.findOne(query, function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, doc);//成功！以数组形式返回查询的结果
            });
        });
    });
};

News.prototype.getList = function(callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("news", function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //根据 query 对象查询文章
            collection.find().sort({
                time: -1
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, docs);//成功！以数组形式返回查询的结果
            });
        });
    });
};

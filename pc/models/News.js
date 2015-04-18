var mongodb = require("./db");

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
//
////读取文章及其相关信息
//Post.get = function(name, callback) {
//    //打开数据库
//    mongodb.open(function (err, db) {
//        if (err) {
//            return callback(err);
//        }
//        //读取 posts 集合
//        db.collection("posts", function(err, collection) {
//            if (err) {
//                mongodb.close();
//                return callback(err);
//            }
//            var query = {};
//            if (name) {
//                query.name = name;
//            }
//            //根据 query 对象查询文章
//            collection.find(query).sort({
//                time: -1
//            }).toArray(function (err, docs) {
//                mongodb.close();
//                if (err) {
//                    return callback(err);//失败！返回 err
//                }
//                callback(null, docs);//成功！以数组形式返回查询的结果
//            });
//        });
//    });
//};

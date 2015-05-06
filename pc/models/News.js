var mongodb = require("./db");
var Action = require("./action/Action");

function News(){
}


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

    new Action.Add("news").execute(news, callback);
};

News.prototype.update = function(id, data, callback){
    new Action.Update("news").execute(id, data, callback);
};

News.prototype.remove = function(id, callback){
    new Action.Remove("news").execute(id, callback);
};

//读取文章及其相关信息
News.prototype.get = function(id, callback) {
    new Action.Get("news").execute(id, callback);
};

News.prototype.getList = function(pageNumber, pageSize, callback) {
    new Action.GetList("news").execute(pageNumber, pageSize, callback);
};

News.prototype.getListByCondition = function(pageNumber, pageSize, filter, callback) {
    new Action.GetListByCondition("news").execute(pageNumber, pageSize, filter, callback);
};

module.exports = News;

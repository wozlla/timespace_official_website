var mongodb = require("./db");
var Action = require("./action/Action");

function Tutorial(){
}

Tutorial.prototype.add = function(tutorialObj, callback) {
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
    var tutorial = tutorialObj;
    tutorial.time = time.day;

    new Action.Add("tutorial").execute(tutorial, callback);
};

Tutorial.prototype.update = function(id, data, callback){
    new Action.Update("tutorial").execute(id, data, callback);
};

Tutorial.prototype.remove = function(id, callback){
    new Action.Remove("tutorial").execute(id, callback);
};

Tutorial.prototype.get = function(id, callback) {
    new Action.Get("tutorial").execute(id, callback);
};
Tutorial.prototype.getByName = function(name, callback) {
    new Action.GetByCondition("tutorial").execute({
        name:name
    }, callback);
};

Tutorial.prototype.getList = function(pageNumber, pageSize, callback) {
    new Action.GetList("tutorial").execute(pageNumber, pageSize, callback);
};

Tutorial.prototype.check = function(id, name, callback) {
    new Action.IsExist("tutorial").execute(id, {
        name: name
    }, callback);
};

module.exports = Tutorial;


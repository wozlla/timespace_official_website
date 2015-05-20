var Action = require("../action/Action");

function BulletinBoard() {
}

BulletinBoard.prototype.add = function (bulletinBoardObj, callback) {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    //todo use moment
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "." + (date.getMonth() + 1),
        day: date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate(),
        minute: date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
    };
    //要存入数据库的文档
    var bulletinBoard = bulletinBoardObj;
    bulletinBoard.time = time.day;

    new Action.Add("bulletinBoard").execute(bulletinBoard, callback);
};

BulletinBoard.prototype.update = function (id, data, callback) {
    new Action.Update("bulletinBoard").execute(id, data, callback);
};

BulletinBoard.prototype.remove = function (id, callback) {
    new Action.Remove("bulletinBoard").execute(id, callback);
};

BulletinBoard.prototype.getFirst = function (callback) {
    //get the first one
    new Action.GetList("bulletinBoard").execute(1, 1, function(err, docs){
        callback(err, docs[0]);
    });
};

BulletinBoard.prototype.getList = function (pageNumber, pageSize, callback) {
    new Action.GetList("bulletinBoard").execute(pageNumber, pageSize, callback);
};
BulletinBoard.prototype.check = function (id, title, callback) {
    new Action.IsExist("bulletinBoard").execute(id, null, callback);
};

module.exports = BulletinBoard;


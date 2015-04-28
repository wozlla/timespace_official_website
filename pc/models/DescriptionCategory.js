var mongodb = require("./db");
var ObjectId = require('mongodb').ObjectID;
var Description = require("./Description");

function DescriptionCategory(){
}


//存储一篇文章及其相关信息
DescriptionCategory.prototype.add = function(descriptionCategoryObj, callback) {
    //要存入数据库的文档
    var descriptionCategory = descriptionCategoryObj;

    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        db.collection("descriptionCategory", function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.insert(descriptionCategory, {
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

DescriptionCategory.prototype.update = function(id, data, callback){
    var self = this;

    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }

        //todo promise

        //cascade delete description where description.category === descriptionCategory.name
        //then delete descriptionCategory
        self.get(id, function (err, model) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            var description = new Description();

            description.updateByCategory(model.name, {
                category: data.name
            }, function (err) {
                db.collection("descriptionCategory", function (err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);
                    }
                    var query = {};
                    if (id) {
                        query._id = new ObjectId(id);
                    }

                    collection.update(query, {
                        $set: data   //only set fields contained in data
                    }, null, function (err) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//失败！返回 err
                        }
                        callback(null);//返回 err 为 null
                    });
                });
            });
        });
    });
};

DescriptionCategory.prototype.remove = function(id, callback){
    var self = this;

    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }

        //todo promise

        //cascade delete description where description.category === descriptionCategory.name
        //then delete descriptionCategory
        self.get(id, function(err, model){
            if (err) {
                mongodb.close();
                return callback(err);
            }

            var description = new Description();

            description.removeByCategory(model.name, function(err){
                db.collection("descriptionCategory", function (err, collection) {
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
        });
    });
};

//读取文章及其相关信息
DescriptionCategory.prototype.get = function(id, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        db.collection("descriptionCategory", function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (id) {
                query._id = new ObjectId(id);
            }
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

DescriptionCategory.prototype.getList = function(callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        db.collection("descriptionCategory", function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find().sort({
                name: -1
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


module.exports = DescriptionCategory;

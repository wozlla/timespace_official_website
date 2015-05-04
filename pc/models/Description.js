var mongodb = require("./db");
var ObjectId = require('mongodb').ObjectID;

function Description() {
}


//存储一篇文章及其相关信息
Description.prototype.add = function (descriptionObj, callback) {
    //要存入数据库的文档
    var description = descriptionObj;
    var db = mongodb.createDb();

    //打开数据库
    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("description", function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }

            collection.insert(description, {
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

Description.prototype.update = function (id, data, callback) {
    var db = mongodb.createDb();

    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("description", function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            var query = {};
            if (id) {
                query._id = new ObjectId(id);
            }

            collection.update(query, {
                $set: data   //only set fields contained in data
            }, null, function (err) {
                db.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null);//返回 err 为 null
            });
        });
    });
};

Description.prototype.updateByCategory = function (category, data, callback) {
    var db = mongodb.createDb();

    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("description", function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            var query = {};
            if (category) {
                query.category = category;
            }

            collection.update(query, {
                $set: data   //only set fields contained in data
            }, {
                multi: true
            }, function (err) {
                /*!because this is used in cascade delete case,
                 so close ouside!

                 db.close();
                 */
                if (err) {
                    //if error, should close whether it's in cascade delete case or not;
                    db.close();
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

Description.prototype.remove = function (id, callback) {
    var db = mongodb.createDb();

    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("description", function (err, collection) {
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


Description.prototype.removeByCategory = function (category, callback) {
    var db = mongodb.createDb();

    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("description", function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            var query = {};
            if (category) {
                query.category = category;
            }

            collection.remove(query, null, function (err) {
                /*!because this is used in cascade delete case,
                 so close ouside!

                 db.close();
                 */
                if (err) {
                    //if error, should close whether it's in cascade delete case or not;
                    db.close();
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

//读取文章及其相关信息
Description.prototype.get = function (id, callback) {
    var db = mongodb.createDb();

    //打开数据库
    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection("description", function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            var query = {};
            if (id) {
                query._id = new ObjectId(id);
            }
            //根据 query 对象查询文章
            collection.findOne(query, function (err, doc) {
                db.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, doc);//成功！以数组形式返回查询的结果
            });
        });
    });
};

Description.prototype.getList = function (callback) {
    var db = mongodb.createDb();

    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        db.collection("description", function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }

            collection.aggregate([
                {
                    $sort: {
                        index:-1
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        data: {
                            $push: "$$ROOT"
                        }
                    }
                }]).toArray(function (err, docs) {
                db.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, docs);//成功！以数组形式返回查询的结果
            });

        });
    });
};

Description.prototype.getListByCondition = function (filter, callback) {
    var db = mongodb.createDb();

    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        db.collection("description", function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }

            collection.aggregate([
               {
                $match:filter
            },
                {
                    $sort: {
                        index:-1
                    }
                },
                {
                $group: {
                    _id: "$category",
                    data: {
                        $push: "$$ROOT"
                    }
                }
            } ]).toArray(function (err, docs) {
                db.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, docs);//成功！以数组形式返回查询的结果
            });

        });
    });
};

Description.prototype.getListByCategory = function (category, callback) {
    var db = mongodb.createDb();

    db.open(function (err, db) {
        if (err) {
            db.close();
            return callback(err);
        }
        db.collection("description", function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }

            collection.find({
                category: category,
                isShow:true
            })
                .sort({
                    index:1
                })
                .toArray(function (err, docs) {
                    db.close();

                    if (err) {
                        return callback(err);//失败！返回 err
                    }

                    callback(null, docs);//成功！以数组形式返回查询的结果
                });
        });
    });
};

module.exports = Description;

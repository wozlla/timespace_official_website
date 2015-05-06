var yoop = require("../../public/js/bower_components/yoop/yOOP");
var mongodb = require("../db");
var ObjectId = require('mongodb').ObjectID;
var extend = require("../../bll/extend");

var Action = yoop.AClass({
    Abstract: {
        execute: function () {
        }
    }
});

var Add = yoop.Class(Action, {
    Init: function (collectionName) {
        this._collectionName = collectionName;
    },
    Private: {
        _collectionName: null
    },
    Public: {
        execute: function (obj, callback) {
            var db = mongodb.createDb(),
                self = this;

            //打开数据库
            db.open(function (err) {
                if (err) {
                    db.close();
                    return callback(err);
                }
                //读取 posts 集合
                db.collection(self._collectionName, function (err, collection) {
                    if (err) {
                        db.close();
                        return callback(err);
                    }

                    collection.insert(obj, {
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
        }
    }
});

var Update = yoop.Class(Action, {
    Init: function (collectionName) {
        this._collectionName = collectionName;
    },
    Private: {
        _collectionName: null
    },
    Public: {
        execute: function (id, data, callback) {
            var db = mongodb.createDb(),
                self = this;

            db.open(function (err) {
                if (err) {
                    db.close();
                    return callback(err);
                }
                db.collection(self._collectionName, function (err, collection) {
                    if (err) {
                        db.close();
                        return callback(err);
                    }
                    var query = {};
                    if (id) {
                        query._id = new ObjectId(id);
                    }

                    collection.update(query, {
                        $set: data   //only set fields contained in data(e.g: not edit "time" field)
                    }, null, function (err) {
                        db.close();
                        if (err) {
                            return callback(err);//失败！返回 err
                        }
                        callback(null);//返回 err 为 null
                    });
                });
            });
        }
    }
});
var Remove = yoop.Class(Action, {
    Init: function (collectionName) {
        this._collectionName = collectionName;
    },
    Private: {
        _collectionName: null
    },
    Public: {
        execute: function (id, callback) {
            var db = mongodb.createDb(),
                self = this;

            db.open(function (err) {
                if (err) {
                    db.close();
                    return callback(err);
                }
                //读取 posts 集合
                db.collection(self._collectionName, function (err, collection) {
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
        }
    }
});
var Get = yoop.Class(Action, {
    Init: function (collectionName) {
        this._collectionName = collectionName;
    },
    Private: {
        _collectionName: null
    },
    Public: {
        execute: function (id, callback) {
            new GetByCondition(this._collectionName).execute({
                _id:new ObjectId(id)
            }, callback);
        }
    }
});

var GetByCondition = yoop.Class(Action, {
    Init: function (collectionName) {
        this._collectionName = collectionName;
    },
    Private: {
        _collectionName: null
    },
    Public: {
        execute: function (filter, callback) {
            var db = mongodb.createDb(),
                self = this;

            //打开数据库
            db.open(function (err) {
                if (err) {
                    db.close();
                    return callback(err);
                }
                //读取 posts 集合
                db.collection(self._collectionName, function (err, collection) {
                    if (err) {
                        db.close();
                        return callback(err);
                    }
                    var query = filter;

                    collection.findOne(query, function (err, docs) {
                        db.close();
                        if (err) {
                            return callback(err);//失败！返回 err
                        }
                        callback(null, docs);//成功！以数组形式返回查询的结果
                    });
                });
            });
        }
    }
});

var GetList = yoop.Class(Action, {
    Init: function (collectionName) {
        this._collectionName = collectionName;
    },
    Private: {
        _collectionName: null
    },
    Public: {
        execute: function (pageNumber, pageSize, callback) {
            var db = mongodb.createDb(),
                self = this,
                skipCount = (pageNumber - 1) * pageSize,
                limitCount = pageSize;

            db.open(function (err) {
                if (err) {
                    db.close();
                    return callback(err);
                }
                //读取 posts 集合
                db.collection(self._collectionName, function (err, collection) {
                    if (err) {
                        db.close();
                        return callback(err);
                    }

                    collection.count(function (err, count) {
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
                                });
                            });
                    });
                });
            });
        }
    }
});

var GetListByCondition = yoop.Class(Action, {
    Init: function (collectionName) {
        this._collectionName = collectionName;
    },
    Private: {
        _collectionName: null
    },
    Public: {
        execute: function (pageNumber, pageSize, filter, callback) {
            var db = mongodb.createDb(),
                self = this,
                skipCount = (pageNumber - 1) * pageSize,
                limitCount = pageSize;

            db.open(function (err) {
                if (err) {
                    db.close();
                    return callback(err);
                }
                db.collection(self._collectionName, function (err, collection) {
                    if (err) {
                        db.close();
                        return callback(err);
                    }

                    //todo optimize:reduce query number
                    collection.find(filter).count(function (err, count) {
                        var pageCount = Math.ceil(count / pageSize);

                        collection.find(filter).sort({
                            time: -1,
                            _id: -1
                        }).skip(skipCount).limit(limitCount)
                            .toArray(function (err, docs) {
                                db.close();
                                if (err) {
                                    return callback(err);
                                }
                                callback(null, docs, {
                                    pageNumber: Number(pageNumber),
                                    pageCount: Number(pageCount)
                                });
                            });
                    });
                });
            });
        }
    }
});
var IsExist = yoop.Class(Action, {
    Init: function (collectionName) {
        this._collectionName = collectionName;
    },
    Private: {
        _collectionName: null
    },
    Public: {
        execute: function (id, filter, callback) {
            var db = mongodb.createDb();

            db.open(function (err) {
                if (err) {
                    db.close();
                    return callback(err);
                }
                //读取 posts 集合
                db.collection("tutorial", function(err, collection) {
                    if (err) {
                        db.close();
                        return callback(err);
                    }

                    var query = {};

                    if(id){
                        //get ones except self
                        query._id = {
                            $ne :new ObjectId(id)
                        };
                    }
                    if(filter){
                        extend.extend(query, filter);
                    }

                    collection.find(query).count(function(err, count) {
                        if(count >= 1){
                            return callback("这个分类已经有了,不能再添加了");
                        }

                        callback(null);
                    });
                });
            });
        }
    }
});

module.exports = {
    Add:Add,
    Update:Update,
    Remove:Remove,
    Get:Get,
    GetByCondition:GetByCondition,
    GetList:GetList,
    GetListByCondition:GetListByCondition,
    IsExist: IsExist
};

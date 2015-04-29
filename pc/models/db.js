var settings = require("../setting"),
    Db = require("mongodb").Db,
    Connection = require("mongodb").Connection,
    Server = require("mongodb").Server;

module.exports.createDb = function(){
    return new Db(
        settings.db,
        new Server(settings.host, settings.dbPort),
        {safe: true}
    );
} ;

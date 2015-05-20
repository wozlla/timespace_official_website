module.exports = {
    //todo should set it to false in ci server!
    isDev: false,    //is developing
    cookieSecret: "wozlla_website",
    db: "timespace_website",
    maxAge: 1000 * 60 * 60 * 24,    //one day
    host: "localhost",
    dbPort: 27017,
    serverPort:3021
};

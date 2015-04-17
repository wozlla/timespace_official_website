function User(){
  this.password = "111111";
}


User.prototype.get = function(name, callback){
  callback(null, this.password);
};

module.exports = User;
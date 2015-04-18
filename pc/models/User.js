function User(){
}

User.prototype.isCorrect = function(name, pwd){
  var name = "admin",
  password = "111111";

  return name === name && pwd === password;
}

module.exports = User;
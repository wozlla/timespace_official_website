function User(){
}

User.prototype.isCorrect = function(name, pwd){
  var name = "admin",
  password = "wozlla@203";

  return name === name && pwd === password;
}

module.exports = User;
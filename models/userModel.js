const mongoose = require('../config/db')

var userSchema=mongoose.Schema({
    name:String,
    password:String,
});

var User=mongoose.model('user',userSchema);

module.exports=User;

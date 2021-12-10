
const { time } = require('console');
const mongoose = require('../config/db')

var ChatSchema=mongoose.Schema({
    username:String,
    msg:String,
    time:String,
    projectName:String
});

var Chat=mongoose.model('chat',ChatSchema);

module.exports=Chat;

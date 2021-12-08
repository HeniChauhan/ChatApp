const mongoose = require('../config/db')

var projectSchema=mongoose.Schema({
    name:String,
});

var Project=mongoose.model('project',projectSchema);

module.exports=Project;

var mongoose=require('mongoose');
const url= "mongodb://localhost:27017/chatdb1";
mongoose.connect(url,{useNewUrlParser:true},function(err){
    if(!err)
     console.log('connection successfull')
    else
    {
      console.log("error occured");
    }
});
module.exports = mongoose;

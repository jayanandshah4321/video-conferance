const mongoose=require('mongoose');

const meetingSchema=mongoose.Schema({
    meetingId:{type:String,required:true,unique:true},
    user_id:{type:String,required:true},
    Date:{type:Date,default:Date.now()},
});

module.exports=mongoose.model('Meeting',meetingSchema); 
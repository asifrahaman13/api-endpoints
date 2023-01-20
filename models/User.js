const mongoose=require('mongoose');
const {Schema}=mongoose;

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    }
});


const User=mongoose.model('user-assignemnt',UserSchema);
module.exports =User;

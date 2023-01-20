const mongoose = require('mongoose');
const {Schema}=mongoose;

const NotesSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    tag:{
        type:String,
    },
    date:{
        type:Date,
        dafault:Date.now
    }
})

module.exports = mongoose.model('notes',NotesSchema)
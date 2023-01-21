const mongoose=require('mongoose');
require('dotenv').config();
const mongoURI=process.env.CONNECTION_URL

const connectToMongoose=async ()=>{
    mongoose.connect(mongoURI, async()=>{
        console.log('Connected to mongoose successfully.');
    })
}

module.exports = connectToMongoose
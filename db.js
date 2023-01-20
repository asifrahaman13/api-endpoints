const mongoose=require('mongoose');
const mongoURI='mongodb+srv://asifr:asifrahaman@cluster0.nelr8ne.mongodb.net/?retryWrites=true&w=majority';

const connectToMongoose=async ()=>{
    mongoose.connect(mongoURI, async()=>{
        console.log('Connected to mongoose successfully.');
    })
}

module.exports = connectToMongoose
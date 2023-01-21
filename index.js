const connectToMongoose=require('./db');
const express=require('express');
const app = express();
var cors=require('cors');

const port=5000;

app.use(cors())
app.use(express.json());
app.use('/api/auth',require('./routes/auth'));

app.get("/",(req,res)=>{
    res.send("Hello world and nice to meet you");
})

app.listen(port,()=>{
    console.log(`Example app is listening in the port: ${port}`);
})

connectToMongoose();
const jwt=require('jsonwebtoken');
const jwt_token = "Harry is a good boy";

const fetchuser=async (req,res,next)=>{
    const token=await req.header('auth-token');
    if(!token){
        // res.status(401).send({error:"Please authenticate using a valid token"});
        console.log("ok");
    }
    try{
        const data=jwt.verify(token,jwt_token);
        req.user=await data.user;
        next();
    }
    catch(err){
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
}
module.exports = fetchuser
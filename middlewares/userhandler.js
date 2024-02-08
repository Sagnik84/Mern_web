import jwt from "jsonwebtoken";
//import cookieParser from "cookie-parser";
//import bodyParser from "body-parser";
import User from "../mongodb.js";
import 'dotenv/config';

const isAuth= async(req,res,next)=>
 {
    const getcookie= req.cookies;
    if(!getcookie.token)
    {
        res.json({
            message:"login first"
        })
    }
    else{const decode= jwt.verify(getcookie.token,process.env.Secretkey)
    //console.log(decode._id)
    let id=decode._id;
    req.user= await User.findById(id)
    next();}
   
 }

 export default isAuth;
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import 'dotenv/config';
const main = mongoose.connect(process.env.Mongo_URL);
main.then(()=>{console.log("mongodb connected")})
main.catch(()=>{console.error("not connected")})

const user=new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    number:{
        type:String,
        default:"euhu"
    },
    myfile:{
        type:String,
        default:"ilasjdl"
    },
    done:{
        type:Boolean,
        default:false
    }
   
})

const User=new mongoose.model("user",user)
export default User

import mongoose from "mongoose";
import jwt from "jsonwebtoken"
const main = mongoose.connect("mongodb+srv://sagnikhalder10:Sagnik@2004@cluster0.drufzyf.mongodb.net/")
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
    }
})

const User=new mongoose.model("user",user)
export default User

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const main = mongoose.connect("mongodb://0.0.0.0:27017/MernWeb")
main.then(()=>{console.log("taskmongodb connected")})
main.catch(()=>{console.error("not connected")})

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        unique:false
    },
    task:{
        type:String,
        unique:false,
        required:true
    },
    isCreated:{
        type:Date,
        default:new Date(Date.now())
    },
    done:{
        type:Boolean,
        default:false,
    },
    UserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Task=new mongoose.model("task",taskSchema)
export default Task;

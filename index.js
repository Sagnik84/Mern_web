import express from "express";
import hbs from "hbs";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import User from "./mongodb.js"
import jwt from "jsonwebtoken";
import isAuth from "./middlewares/userhandler.js";
import sendcookie from "./utils/cookie.js";
import Task from "./taskmongodb.js";
import 'dotenv/config';
import cors from "cors";
import { customAlphabet } from 'nanoid';
import QRCode from 'qrcode'

const app = express();
const port = process.env.PORT||4000;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.set("view engine", "hbs")
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
}))

app.get("/", (req, res) => {
    res.redirect("/register")
})
app.get("/register", (req, res) => {
    res.render("register.hbs")
})
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const alphabet = 'SLA0123456789';

    // Create a function that generates IDs
    const generateID = customAlphabet(alphabet, 10);
  
    // Generate an ID
    const id = generateID();
  
    //console.log('Generated ID:', id);
  
    const generateQR = async (id,text) => {
     
      try {
  
        //console.log(await QRCode.toDataURL(text))
        const Base64 = await QRCode.toDataURL(text)
        //const user = await User.create({ number: id, myfile: Base64 })
        const user = await User.create({ name, email, password, number: id, myfile: Base64 })
        sendcookie(user, res, "registered succesfully", 201)
      } catch (err) {
        console.error(err)
      }
    }
    generateQR(id,`${id}`)
})
app.get("/login", (req, res) => { res.render("login.hbs") })
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }) // identify the user
    //not a user 
    if (!user) {
        res.status(404).json({
            success: false,
            message: "invalid email or password,register first"
        })
    }
    // real user ,,,password correct with req.body.pass == user password
    else if (user.password === password) {
        sendcookie(user, res, "login succesfully", 200);
    }
    //user but password incorrect
    else {
        res.status(404).json({
            success: false,
            message: "invalid password"
        })
    }

})
app.get("/logout", isAuth, (req, res) => {
    res.cookie("token", "null", {
        httpOnly:true,
        maxAge: 0,
        sameSite:process.env.Node_ENV==="development"? "lax":"none",
        secure:process.env.Node_ENV==="development"? false:true,
    })
        .json({ message: "logout successfully" })
})
app.get("/myProfile", isAuth, async (req, res) => {
    res.json({
        message: "fetch succfully",
        success: true,
        user: req.user
    })
})
app.post("/app/v1/newtask", isAuth, async (req, res) => {
    const getcookie = req.cookies;
    const decode = jwt.verify(getcookie.token, process.env.Secretkey)
    //console.log(decode._id)
    let userid = decode._id;
    const { title, task } = req.body;
    const Usertask = await Task.create({ title, task, UserId: userid })
    res.json({
        message: "new Work",
        success: true,
        Usertask
    })

})
app.get("/app/v1/alltask", isAuth, async (req, res) => {
    const getcookie = req.cookies;
    const decode = jwt.verify(getcookie.token, process.env.Secretkey)
    //console.log(decode._id)
    let userid = decode._id;
    const allwork = await Task.find({ UserId: userid })
    //console.log(allwork)
    res.json({
        message: "succesful",
        allwork,
    })
})

app.get("/ShowQr",isAuth,async(req,res)=>{
    //const id=req.params.id
    res.json({
      message: "fetch succfully",
      success: true,
      user: req.user.myfile
    })
  })
app.put("/update/:id", isAuth, async (req, res) => {
    const IdOfTask = req.params.id;
    //console.log(IdOfTask)
    const find = await Task.findOne({ _id: IdOfTask })
    await Task.findOneAndUpdate(find._id, { done: !find.done })

    //this is to show all work of the specific user ,means /allwork
    const getcookie = req.cookies;
    const decode = jwt.verify(getcookie.token, process.env.Secretkey)
    //console.log(decode._id)
    let userid = decode._id;
    const allwork = await Task.find({ UserId: userid })
    res.json({
        message: "updated",
        success: true,
        allwork
    })
})
app.delete("/delete/:id", isAuth, async (req, res) => {
    const IdOfTask = req.params.id;

    await Task.deleteOne({ _id: IdOfTask })

    //this is to show all work of the specific user ,means /allwork
    const getcookie = req.cookies;
    const decode = jwt.verify(getcookie.token, process.env.Secretkey)
    //console.log(decode._id)
    let userid = decode._id;
    const allwork = await Task.find({ UserId: userid })
    res.json({
        message: "Deleted",
        success: true,
        allwork
    })
})
app.listen(port, (req, res) => {
    console.log(`connected to ${port} and in ${process.env.Node_ENV} mode`)
})
 import jwt from "jsonwebtoken";
 import 'dotenv/config';
 const sendcookie = (user, res, message, statuscode=200) => {
   const usertoken =jwt.sign({ _id: user._id, }, process.env.Secretkey);
    res.status(statuscode)
        .cookie("token",usertoken , 
        { maxAge: 1000000,
         httpOnly: true,
        sameSite:process.env.Node_ENV==="development"? "lax":"none",
        secure:process.env.Node_ENV==="development"? false:true,
        })
        .json({
            message,
            user
        })
}
export default sendcookie;
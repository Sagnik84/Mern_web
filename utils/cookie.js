 import jwt from "jsonwebtoken";
 import 'dotenv/config';
 const sendcookie = (user, res, message, statuscode=200) => {
   const usertoken =jwt.sign({ _id: user._id, }, 'eswghjgu');
    res.status(statuscode)
        .cookie("token",usertoken , 
        { maxAge: 1000000,
         httpOnly: true,
        //sameSite:"strict",
        //secure:"true",
        })
        .json({
            message,
            user
        })
}
export default sendcookie;
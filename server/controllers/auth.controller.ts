import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import jsonwebtoken from 'jsonwebtoken';
import { MailOptions } from "nodemailer/lib/json-transport";
import transport from "../config/emailTransport";
import { UserInterface, UserModel } from "../models/User";
import { ValidateLogin, validateUser } from "../validations/user.validate";
import { EmailVerifyTemplate } from "../config/emailTemplate";
export const registerUser = async (req: Request, res: Response) => {
   const { error } = validateUser(req.body);
   const {username, email, password}: UserInterface = req.body
   if (error) {
      res.status(400).send(error.details[0].message);
      return
   }
   try {
      const existUser = await UserModel.findOne({ email });
      if (existUser) {
         res.status(400).send("This email Is Taken Choose another one");
         return
      }
      const hashPassword = await hash(password, 10);
      const newUser = await new UserModel({ username, email, password: hashPassword }).save();
      const token = newUser.generateToken();
      res.cookie("token", token, {
         maxAge: 15 * 60 * 1000,
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite:"none"
      }).send("User successful Registered");

      const mailOptions: MailOptions = {
         from: `Claudistack | full stack developer ${process.env.EMAIL_USER}`,
         to: email,
         subject: "Welcome to claudistack",
         text: `
         Dear ${username}!
         Welcome to Fullstack developer, Your Account Has been successful created with an email ${email} Please Consider Verify Your Account 
         `
      } 
      await transport.sendMail(mailOptions)
      
   } catch (error:any) {
      console.log(error.message);
      
   }
}
export const loginUser = async (req: Request, res: Response) => {
   const { error } = ValidateLogin(req.body);
   const {email, password}: UserInterface = req.body
   if (error) {
      res.status(400).send(error.details[0].message);
      return
   }
   try {
      const user = await UserModel.findOne({ email });
      if (!user) {
         res.status(400).send("Incorrect Email");
         return
      }
      const comparePassword = await compare(password, user.password);
      if (!comparePassword) {
         res.status(400).send("Incorrect password");
         return
      }
      const token = user.generateToken();
      res.cookie("token", token, {
         maxAge: 15 * 60 * 1000,
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "none"
      }).json({message: "Login successful", userId: user._id});
   } catch (error: any) {
      console.log(error.message);
      
  }
}
export const logoutUser = async (req: Request, res: Response) => {
   res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
   }).send("logout successful");
}
export const sendOtp = async (req: Request, res: Response) => {
   const { _id } = (req as any).user;
   if (!_id) {
      res.status(400).send("Provide user id");
      return
   } 
   try {
      const user = await UserModel.findById(_id);
      if (!user) {
         res.status(400).send("No user found");
         return
      }
      if (user.isVerified) {
         res.status(400).send("This Account Already verified");
         return
      }
      const otp = Math.floor(Math.random() * 1000000).toString();
      const expireDate = Date.now() * 3 * 60 * 1000; // 3min
      await user.updateOne({ verifyOtp: otp, otpExpireAt: expireDate });
      await transport.sendMail({
         from: `Claudistack | full stack developer ${process.env.EMAIL_USER}`,
         to: user.email,
         subject: "Welcome to claudistack",
         html: EmailVerifyTemplate.replace("{{name}}", user.username).replace("{{otp}}", otp)
      });
      res.send(`OTP sent successful To ${user.email}`);
   } catch (error: any) {
      console.log(error.message);
   }

}
export const verifyEmail = async (req: Request, res: Response) => {
   const { userId, otp } = req.body;
   if (!userId || !otp) {
      res.status(400).send("Enter userId And Otp");
      return
   }
   try {
      const user = await UserModel.findById(userId);
      if (!user) {
         res.status(400).send("The User does not exist");
         return
      }
      if (user.verifyOtp === "" || user.verifyOtp !== otp) {
         res.status(400).send("Invalid Otp");
         return
      }
      if (user.otpExpireAt < Date.now()) {
         res.status(400).send("OTP Expired Request New");
         return
      }
      await UserModel.findByIdAndUpdate(userId, { isVerified: true, otpExpireAt: 0, verifyOtp: "" });
      res.send("Successful Verified")
   } catch (error:any) {
      console.log(error.message);
   }

}
export const sendResetOtp = async (req: Request, res: Response) => {
   const { email } = req.body;
   if (!email) {
      res.status(400).send("Provide Your Email");
      return
   }
   const resetOtp = Math.floor(Math.random() * 1000000).toString();
   const resetExpireAt = Date.now() * 3 * 60 * 1000;
   try {
      const user = await UserModel.findOne({ email });
      if (!user) {
         res.status(400).send("Invalid Email");
         return
      }
      user.resetOtp = resetOtp
      user.resetExpireAt = resetExpireAt;
      await user.save()
      const mailOptions: MailOptions = {
         from: `FullStack Web Developer | ${process.env.EMAIL_USER}`,
         to: user.email,
         subject: "OTP Reset Password",
         text: `
         Hello ${user.username} !
         Here is your Rest OTP To reset Your Password ${resetOtp}.`,
         date: Date.now().toString()
      }
      await transport.sendMail(mailOptions);
      res.send("OTP sent successfully");
   } catch (error: any) {
      res.status(400).send("Something Went Wrong")  
   }
}
export const verifyPasswordOtp = async (req: Request, res: Response) => {
   const { otp, email} = req.body;
   if (!otp || !email) {
      res.status(400).send("Provide Your otp and email");
      return
   }
   try {
      const user = await UserModel.findOne({email});
      if (!user) {
         res.status(400).send("user not Found");
         return
      };
      if (user.resetOtp === "" || user.resetOtp !== otp) {
         res.status(400).send("Invalid OTP");
         return
      }
      if (user.resetExpireAt < Date.now()) {
         res.status(400).send("Reset Password Otp Expired Request New");
         return
      }
      res.send("Change Your Password Now")
   } catch (error: any) {
      console.log(error.message);
      
   }

}
export const isLogged = async (req: Request, res: Response) => {
const { token } = req.cookies;
   if (!token) {
      res.status(403).send("You are not Authenticated")
      return
   }
   try {
      if (process.env.JWT_SECRET_KEY) {
         const decodedUser = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY) 
      if (!decodedUser) {
         res.status(401).send("You are not Authorized");
         return
         }
      }
      res.json({ isLoggedIn: true });
   } catch (error: any) {
      console.log(error.message);  
   }
}

export const resetPassword = async(req: Request, res: Response) => {
   const { newPassword, email } = req.body;
   if (!newPassword || !email) {
      res.status(400).send("Provide email and new password");
      return
   }
   try {
      const user = await UserModel.findOne({email});
      if (!user) {
         res.status(400).send("user not Found");
         return
      };
      const password = await hash(newPassword, 10);
      user.password = password;
      user.resetExpireAt = 0;
      user.resetOtp = "";
      await user.save();
      res.send("Password Successful Changed")
   } catch (error: any) {
      console.log(error.message);
      
   }
}
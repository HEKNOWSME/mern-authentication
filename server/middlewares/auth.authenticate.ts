import { NextFunction, Request, Response } from "express";
import jsonwebtoken from 'jsonwebtoken';
const auth = (req: Request, res: Response, next: NextFunction) => {
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
      next()
   } catch (error: any) {
      console.log(error.message);  
   }
   
}
export default auth
import  jsonwebtoken, { JwtPayload }  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
interface DecodedUser extends JwtPayload {
   _id: string;
   email: string;
}

const userAuth = (req: Request, res: Response, next: NextFunction) => {
   const { token } = req.cookies;
   if (!token) {
      res.status(403).send("You are not Authenticated")
      return
   }
   try {
      if (process.env.JWT_SECRET_KEY) {
         const decodedUser = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY) as DecodedUser
      if (!decodedUser || !decodedUser._id) {
         res.status(401).send("You are not Authorized");
         return
         }
         (req as any).user = decodedUser;
         req.body.userId = decodedUser._id
         next()
      }
   } catch (error: any) {
      console.log(error.message);
   }
}
export default userAuth
import { Response, Request, NextFunction } from "express"
import { isValidObjectId } from "mongoose";
const checkValidId = (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
         res.status(400).send("Invalid Id")
         return
      }
      next()
   } catch (error: any) {
      res.status(400).send(error.message);
      return
   }
}
export default checkValidId
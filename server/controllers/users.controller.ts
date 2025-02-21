import { Request, Response } from "express"
import { UserModel } from "../models/User"

const getCurrentUserData = async (req: Request, res: Response) => {
   const {_id} = (req as any).user 
   const users = await UserModel
      .findById(_id)
      .select("username email isVerified -_id")
   res.send(users) 
}
const deleteUser = async (req: Request, res: Response) => {
   res.send("Check deleted")
}

const UpdateUser = async (req: Request, res: Response) => {
   res.send("Check update")
}
export { deleteUser, getCurrentUserData, UpdateUser }

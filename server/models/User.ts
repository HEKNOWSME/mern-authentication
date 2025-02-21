import jsonwebtoken from "jsonwebtoken";
import { Document, Schema, model } from 'mongoose';
interface UserInterface extends Document {
   username: string;
   email: string;
   password: string;
   verifyOtp: string;
   otpExpireAt: number;
   resetOtp: string;
   resetExpireAt: number;
   isVerified: boolean;
   isLive: boolean;
   generateToken: () => void;
}
const userSchema = new Schema<UserInterface>({
   username: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   verifyOtp: { type: String, default: ""},
   otpExpireAt: { type: Number, default: 0},
   resetOtp: { type: String, default: "" },
   resetExpireAt: { type: Number, default: 0 },
   isVerified: { type: Boolean, default: false },
})
userSchema.methods.generateToken = function () {
   if (process.env.JWT_SECRET_KEY) return jsonwebtoken.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15min"
   });
}

const UserModel = model("User", userSchema);
export { UserInterface, UserModel };

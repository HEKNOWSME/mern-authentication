import mongoose from "mongoose"
const connectDb = async () => {
   try {
      await mongoose.connect(`${process.env.MONGO_DB_URL}/authentication`)
      return console.log("Connected to Database")
   } catch (err: any) {
      return console.log(err.message)
   }
}
export default connectDb
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser"
import express, { json } from "express";
import connectDb from "./config/mongoDb";
import userRouter from "./routers/auth.routes";
import userDataRouter from "./routers/user.routes";
config();
const app = express();
const port = process.env.PORT || 3000;
connectDb()
app.use(cookieParser())
app.use(json());
app.use(cors({ credentials: true , origin: "https://mern-authentication-pi.vercel.app",}));
app.use("/api/users", userRouter);
app.use("/api/users", userDataRouter);
app.get("/", (req, res) => {
   res.send("Hello World")
});
app.listen(port, () => console.log(`Listen to the port ${port}`)
)
import { config } from "dotenv";
import { createTransport } from "nodemailer";
config();
const transport = createTransport({
   service: "gmail",
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS
   },
   tls: {
      rejectUnauthorized: false
   }
})

export default transport
import axios, {CanceledError} from "axios";
export default axios.create({
   baseURL: "https://mern-authentication-15sl.onrender.com/api/",
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   }
})
export {CanceledError}
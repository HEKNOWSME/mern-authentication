import axios, {CanceledError} from "axios";
export default axios.create({
   baseURL: "https://mern-authentication.azurewebsites.net/api/",
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   }
})
export {CanceledError}
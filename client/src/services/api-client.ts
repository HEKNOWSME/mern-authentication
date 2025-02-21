import axios, {CanceledError} from "axios";
export default axios.create({ baseURL: "https://mern-authentication-n611.onrender.com/api/" })
export {CanceledError}
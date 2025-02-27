import axios, {CanceledError} from "axios";
export default axios.create({ baseURL: "https://mern-authentication.azurewebsites.net/api/" })
export {CanceledError}
import { createContext, Dispatch } from "react";

export interface UserInterface {
   username: string;
   email: string;
   isVerified: boolean;
   isAlive: boolean;
}
interface UserContextInterface {
   isLoggedIn: boolean;
   isLoading: boolean;
   showProfile: boolean;
   login: () => void;
   logout: () => void;
   userData?: UserInterface;
   setProfile: Dispatch<boolean>;
}
const UserContext = createContext<UserContextInterface>({} as UserContextInterface)
export default UserContext
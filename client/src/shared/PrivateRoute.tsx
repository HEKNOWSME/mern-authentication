import { useContext } from "react";

import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../contexts/userContext";

const PrivateRoute = () => {
	const { isLoading, isLoggedIn } = useContext(UserContext);
	if (!isLoading && !isLoggedIn) return <Navigate to="/login" />;
	return <Outlet />;
};

export default PrivateRoute;

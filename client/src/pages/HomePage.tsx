import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import UserContext, { UserInterface } from "../contexts/userContext";
import Toast from "../shared/Toast";
import apiClient from "../services/api-client";

const HomePage = () => {
	const [isLoggedIn, setLoggedIng] = useState(false);
	const [isLoading, setLoading] = useState(true);
	const [showProfile, setProfile] = useState(false);
	const [userData, setUser] = useState<UserInterface>();
	console.log(isLoggedIn);
	
	const login = useCallback(() => {
		setLoggedIng(true);
	}, []);
	const logout = useCallback(() => {
		setLoggedIng(false);
	}, []);
	useEffect(() => {
		apiClient
			.get<UserInterface>("/users", { withCredentials: true })
			.then((data) => {
				setUser(data.data);
				setLoggedIng(true);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}, [isLoggedIn]);
	return (
		<div className="min-h-screen h-screen bg-slate-950 text-white flex flex-col">
			<UserContext.Provider
				value={{
					isLoading,
					isLoggedIn,
					login,
					logout,
					userData,
					showProfile,
					setProfile,
				}}
			>
				<div className="h-16 z-50">
					<NavBar />
				</div>
				<div className="show flex-1 overflow-hidden relative">
					<Toast />
					<Outlet />
				</div>
			</UserContext.Provider>
		</div>
	);
};

export default HomePage;

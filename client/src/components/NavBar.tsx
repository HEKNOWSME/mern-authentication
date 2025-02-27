import { useContext } from "react";
import { LuCircleUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import UserContext from "../contexts/userContext";
import DropDown from "./DropDown";
const NavBar = () => {
	const navigate = useNavigate();
	const { isLoggedIn, userData, setProfile, showProfile } =
		useContext(UserContext);
	
	return (
		<div className="w-full flex justify-between sticky top-0 px-2 items-center bg-cyan-500">
			<img
				src={assets.Logo}
				alt=""
				className="w-36 sm:w-32 cursor-pointer  max-w-full"
				onClick={() => navigate("/")}
			/>
			<div className="" onClick={() => setProfile(!showProfile)}>
				{isLoggedIn ? (
					<div className="flex items-center cursor-pointer gap-4">
						<span>{userData?.username}</span>
						<LuCircleUser size={25} color="yellow" />
					</div>
				) : (
					<button
						type="button"
						className="rounded px-4 flex justify-center items-center bg-gray-100 text-slate-900 py-2 hover:bg-slate-400"
						onClick={() => navigate("/login")}
					>
						Login
					</button>
				)}
			</div>
			{isLoggedIn && showProfile && (
				<div className="flex justify-end absolute top-16 right-0">
					<DropDown
						username={userData?.username}
						isVerified={userData?.isVerified}
					/>
				</div>
			)}
		</div>
	);
};

export default NavBar;

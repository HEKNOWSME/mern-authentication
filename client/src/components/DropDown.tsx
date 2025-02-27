import { LuBadgeCheck, LuLogOut, LuUser } from "react-icons/lu";
import apiClient from "../services/api-client";
import { useContext } from "react";
import UserContext from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
interface Props {
	username?: string;
	isVerified?: boolean;
}

const DropDown = ({ username, isVerified }: Props) => {
	const { logout, isLoggedIn, setProfile } = useContext(UserContext);
	const navigate = useNavigate();
	const handleLogout = async () => {
		if (!isLoggedIn) {
			return navigate("/", { replace: true });
		}
		apiClient
			.post("/users/logout", {})
			.then(({ data }) => {
				navigate("/", { replace: true });
				toast.success(data);
				logout();
			})
			.catch((err) => console.log(err));
	};
	return (
		<div
			className="rounded-b bg-cyan-500 max-w-fit text-slate-300 flex flex-col gap-4 p-3 justify-end"
			onClick={() => setProfile(false)}
		>
			<p className="flex items-center cursor-pointer gap-2">
				<LuUser size={25} color="yellow" />
				<span className="text-slate-100">{username}</span>
			</p>
			<p
				className={`flex items-center cursor-pointer gap-2 ${
					!isVerified ? "text-red-600" : "text-green-600"
				}`}
				onClick={() => {
					if (!isVerified) {
						apiClient
							.post("users/sendOtp", {}, { withCredentials: true })
							.then(({ data }) => {
								toast.success(data);
								navigate("/verify");
							})
							.catch((e) => toast.error(e.response.data));
					} else {
						toast.warning("You are verified", { position: "bottom-right" });
					}
					if (!isLoggedIn) return navigate("/", { replace: true });
				}}
			>
				<i>
					<LuBadgeCheck size={25} />
				</i>
				<span>{isVerified ? "Verified" : "Verify"}</span>
			</p>

			<p
				className="flex items-center cursor-pointer gap-2"
				onClick={handleLogout}
			>
				<i className="hover:translate-x-1">
					<LuLogOut size={25} />
				</i>
				<span>Logout</span>
			</p>
		</div>
	);
};

export default DropDown;

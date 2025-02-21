import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { LuLock, LuMail, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../contexts/userContext";
import apiClient from "../services/api-client";
interface UserInterface {
	username: string;
	email: string;
	password: string;
}
const LoginPage = () => {
	const [showLogin, setLogin] = useState(true);
	const navigate = useNavigate();
	const { register, handleSubmit, reset } = useForm<UserInterface>();
	const { login } = useContext(UserContext);
	const handleOnSubmit = (user: UserInterface) => {
		const userData = { email: user.email, password: user.password };
		if (!showLogin) {
			apiClient
				.post("/users/register", user, { withCredentials: true })
				.then(({ data }) => {
					toast.success(data, { position: "bottom-right" });
					navigate("/login");
					setLogin(true);
					reset();
				})
				.catch((err) => {
					toast.warning(err.response.data, { position: "bottom-right" });
				});
		} else {
			apiClient
				.post("/users/auth", userData, { withCredentials: true })
				.then(({ data }) => {
					toast.success(data.message, { position: "bottom-right" });
					login();
					localStorage.setItem("loggedIn", JSON.stringify(true));
					reset();
					navigate("/private", { replace: true });
				})
				.catch((err) => {
					toast.warning(err.response.data, { position: "bottom-right" });
				});
		}
	};
	return (
		<div className="bg-slate-800 rounded-lg left-10 sm:left-96 p-2 max-w-max m-auto mt-36">
			<form
				className="bg-slate-800 rounded-lg p-5 w-full text-indigo-300"
				onSubmit={handleSubmit(handleOnSubmit)}
			>
				<h2 className="text-center mb-4 text-2xl">
					{showLogin ? "Login To your Account" : "Create Your Account"}
				</h2>
				{!showLogin && (
					<div className="mb-3 rounded-full bg-[#333A5C] flex py-2 px-3 gap-1 justify-center items-start">
						<LuUser size={20} />
						<input
							{...register("username", {
								required: "Field Required",
								minLength: {
									value: 5,
									message: "Username Could Be Above 5 characters",
								},
							})}
							type="text"
							name="username"
							autoComplete="username"
							required
							className="outline-none bg-transparent flex-1"
							placeholder="Enter Your Name"
						/>
					</div>
				)}

				<div className="mb-3 rounded-full bg-[#333A5C] flex py-2 px-3 gap-1 justify-center items-start">
					<i>
						<LuMail size={20} />
					</i>
					<input
						{...register("email", {
							required: "Field Required",
						})}
						type="email"
						name="email"
						autoComplete="email"
						required
						className="outline-none bg-transparent flex-1"
						placeholder="Enter Your Email"
					/>
				</div>
				<div className="mb-3 rounded-full bg-[#333A5C] flex py-2 px-3 gap-1 justify-center items-start">
					<i>
						<LuLock size={20} />
					</i>
					<input
						{...register("password", {
							required: "Field Required",
							minLength: {
								value: 5,
								message: "Password Could Be Above 5 characters",
							},
						})}
						type="password"
						name="password"
						autoComplete="new-password"
						required
						className="outline-none bg-transparent flex-1"
						placeholder="Enter Your Password"
					/>
				</div>
				<div className="mb-3">
					<p
						className="cursor-pointer text-indigo-500 my-2"
						onClick={() => navigate("/reset")}
					>
						Forgot Password?{" "}
					</p>
					<button
						type="submit"
						className="p-1 w-full bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white font-medium"
					>
						{!showLogin ? "Register" : "Login"}
					</button>
				</div>
			</form>
			{!showLogin ? (
				<p className="text-gray-400 text-center mb-3">
					Already Have An Account?{" "}
					<span
						className="underline cursor-pointer text-blue-400"
						onClick={() => setLogin(true)}
					>
						Login Here
					</span>
				</p>
			) : (
				<p className="text-gray-400 text-center mb-3">
					Don`t` Have An Account?{" "}
					<span
						className="underline cursor-pointer text-blue-400"
						onClick={() => setLogin(false)}
					>
						SignUp
					</span>
				</p>
			)}
		</div>
	);
};

export default LoginPage;

import React, { useRef, useState } from "react";
import { LuLock, LuMail } from "react-icons/lu";
import apiClient from "../services/api-client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
	const emailRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);
	const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
	const [credentials, setCredentials] = useState({
		email: "",
		otp: "",
		password: "",
	});
	const navigate = useNavigate();
	const [reset, setReset] = useState({
		email: true,
		opt: false,
		password: false,
	});
	const handleEmail = (e: React.FormEvent) => {
		e.preventDefault();
		apiClient
			.post(
				"/users/sendResetOtp",
				{ email: emailRef.current?.value },
				{ withCredentials: true }
			)
			.then(({ data }) => {
				toast.success(data);
				setReset({ ...reset, opt: true, email: false });
				if (emailRef.current)
					setCredentials({ ...credentials, email: emailRef.current.value });
			})
			.catch((e) => toast.error(e.response.data));
	};
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		if (e.target.value.length > 0 && index < otpRefs.current.length - 1) {
			otpRefs.current[index + 1]?.focus();
		}
	};
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number
	) => {
		const target = e.target as HTMLInputElement;
		if (index > 0 && target.value === "" && e.key === "Backspace") {
			otpRefs.current[index - 1]?.focus();
		}
	};
	const handleOtpSend = (e: React.FormEvent) => {
		e.preventDefault();
		const newOpt = otpRefs.current.map((input) => input?.value).join("");
		apiClient
			.post("/users/verifyOtp", {
				otp: newOpt,
				email: credentials.email,
			})
			.then(({ data }) => {
				toast.success(data);
				setReset({ ...reset, opt: false, password: true });
			})
			.catch((e) => toast.error(e.response.data));
	};
	const handleReset = (e: React.FormEvent) => {
		e.preventDefault();
		apiClient
			.post("/users/reset", {
				email: credentials.email,
				newPassword: passwordRef.current?.value,
			})
			.then(({ data }) => {
				toast.success(data);
				navigate("/login", { replace: true });
			})
			.catch((e) => toast.error(e.response.data));
	};
	const handlePaste = (e: React.ClipboardEvent<HTMLFormElement>) => {
		e.preventDefault();
		const pasted = e.clipboardData.getData("text").split("");
		pasted.forEach((otp, index) => {
			if (otpRefs.current[index]) otpRefs.current[index].value = otp;
		});
	};
	return (
		<div>
			{reset.email && (
				<form
					action=""
					className="bg-gradient-to-br p-5 from-indigo-400 to-cyan-500 mt-36 m-auto rounded max-w-max"
					onSubmit={handleEmail}
				>
					<h2 className="text-xl font-bold text-center">Reset Password</h2>
					<p className="text-slate-300">Enter Your Registered Email Address </p>
					<div className="mt-3 flex items-center  rounded bg-gradient-to-t from-fuchsia-100 to-fuchsia-300 gap-2 py-1 px-2">
						<LuMail color="indigo" size={20} />
						<input
							type="email"
							name="email"
							autoComplete="email"
							className="w-full flex-1 outline-none border-0 bg-gradient-to-t from-fuchsia-100 to-fuchsia-300 text-indigo-500"
							aria-label="email"
							required
							ref={emailRef}
						/>
					</div>
					<button
						type="submit"
						className="w-full rounded-full  px-2 py-1 mt-2 bg-gradient-to-t from-fuchsia-100 text-slate-500"
					>
						Submit
					</button>
				</form>
			)}
			{reset.opt && (
				<form
					action=""
					className="bg-gradient-to-br p-5 from-indigo-400 to-cyan-500 mt-36 m-auto rounded max-w-max"
					onSubmit={handleOtpSend}
					onPaste={handlePaste}
				>
					<h2 className="text-xl font-bold text-center">
						Verify Your Reset Password
					</h2>
					<p className="text-slate-300 text-center">
						Enter 6-digit Digit code sent To Your Email Account{" "}
					</p>
					<div className="mt-3 rounded gap-2 flex max-w-max m-auto">
						{Array(6)
							.fill("")
							.map((_, index) => (
								<input
									type="text"
									aria-label="otp"
									key={index}
									className="rounded w-12 h-10 border-0 outline-none text-indigo-950 p-2 text-2xl text-center"
									required
									ref={(e) => (otpRefs.current[index] = e)}
									onChange={(e) => handleChange(e, index)}
									onKeyDown={(e) => handleKeyDown(e, index)}
								/>
							))}
					</div>
					<button
						type="submit"
						className="w-full rounded-full  px-2 py-1 mt-2 bg-gradient-to-t from-fuchsia-100 text-slate-500"
					>
						Verify Reset Otp
					</button>
				</form>
			)}
			{reset.password && (
				<form
					action=""
					className="bg-gradient-to-br p-5 from-indigo-400 to-cyan-500 mt-36 m-auto rounded max-w-max"
					onSubmit={handleReset}
				>
					<h2 className="text-xl font-bold text-center">Reset Password</h2>
					<p className="text-slate-300 text-center">Enter Your New password </p>
					<div className="mt-3 flex items-center  rounded bg-gradient-to-t from-fuchsia-100 to-fuchsia-300 gap-2 py-1 px-2">
						<LuLock color="indigo" size={20} />
						<input
							type="password"
							name="password"
							autoComplete="new-password"
							className="w-full flex-1 outline-none border-0 bg-gradient-to-t from-fuchsia-100 to-fuchsia-300 text-indigo-500"
							aria-label="email"
							ref={passwordRef}
						/>
					</div>
					<button
						type="submit"
						className="w-full rounded-full  px-2 py-1 mt-2 bg-gradient-to-t from-fuchsia-100 text-slate-500"
					>
						Change Password
					</button>
				</form>
			)}
		</div>
	);
};

export default ResetPassword;

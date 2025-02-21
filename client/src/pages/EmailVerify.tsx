import React, { ChangeEvent, useContext, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../contexts/userContext";
import apiClient from "../services/api-client";

const EmailVerify = () => {
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
	const { userData } = useContext(UserContext);
	const navigate = useNavigate();
	const handleInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	};
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number
	) => {
		const target = e.target as HTMLInputElement;
		if (e.key === "Backspace" && index > 0 && target.value === "") {
			inputRefs.current[index - 1]?.focus();
		}
	};
	const handlePaste = (e: React.ClipboardEvent<HTMLFormElement>) => {
		const paste = e.clipboardData?.getData("text");
		const pasteArray = paste?.split("");
		pasteArray?.forEach((char, index) => {
			if (inputRefs.current[index]) inputRefs.current[index].value = char;
		});
	};
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const optArray = inputRefs.current.map((input) => input?.value).join("");
		apiClient
			.post("users/verifyEmail", { otp: optArray }, { withCredentials: true })
			.then(({ data }) => {
				toast.success(data);
				window.location.reload();
				navigate("/", { replace: true });
			})
			.catch((e) =>
				toast.error(e.response.data, { position: "bottom-center" })
			);
	};
	if (userData?.isVerified) return <Navigate to="/private" />;
	return (
		<div className="bg-[#c4f4fb33] p-5 rounded text-center max-w-max m-auto mt-36">
			<div className="">
				<h2 className="text-center font-bold text-2xl">Verify Your Account</h2>
				<p className="text-indigo-100">
					Enter 6-digit Digit code sent To Your Email Account{" "}
				</p>
				<form
					action=""
					className="top-1/2 mt-3"
					onPaste={handlePaste}
					onSubmit={handleSubmit}
				>
					{Array(6)
						.fill(0)
						.map((_, index) => (
							<input
								type="text"
								maxLength={1}
								required
								aria-label="otp"
								key={index}
								className="bg-slate-600 m-1 w-12 border-none outline-none h-9 text-2xl text-center"
								ref={(e) => (inputRefs.current[index] = e)}
								onChange={(e) => handleInput(e, index)}
								onKeyDown={(e) => handleKeyDown(e, index)}
							/>
						))}
					<div className="mt-3">
						<button
							className="rounded px-4 py-1 bg-zinc-200 w-full bg-gradient-to-tr from-indigo-500 to-indigo-900"
							type="submit"
						>
							Verify Email
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EmailVerify;

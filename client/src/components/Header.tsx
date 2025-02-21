import { NavLink } from "react-router-dom";

const Header = () => {
	return (
		<header className=" py-6 px-4 text-center shadow-md">
			<h1 className="text-4xl font-extrabold mb-2">Welcome to ClaudIStack</h1>
			<p className="text-lg text-gray-300 max-w-2xl mx-auto">
				Crafting modern web experiences with the power of MERN FullStack.
				Focused on building scalable solutions, empowering young talents, and
				making an impact through code.
			</p>
			<button
				type="button"
				className="px-2 rounded bg-gray-100 text-slate-900 mt-7 py-2"
			>
				<NavLink to={"/private"}>Get Started</NavLink>
			</button>
		</header>
	);
};

export default Header;

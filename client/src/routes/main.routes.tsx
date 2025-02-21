import { createBrowserRouter } from "react-router-dom";
import Header from "../components/Header";
import EmailVerify from "../pages/EmailVerify";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import Private from "../pages/Private";
import ResetPassword from "../pages/ResetPassword";
import PrivateRoute from "../shared/PrivateRoute";

const router = createBrowserRouter([
	{ errorElement: <NotFound /> },
	{
		element: <HomePage />,
		children: [
			{ index: true, element: <Header /> },
			{ path: "/login", element: <LoginPage /> },
			{ path: "/reset", element: <ResetPassword /> },
			{
				element: <PrivateRoute />,
				children: [
					{ path: "/verify", element: <EmailVerify /> },
					{
						path: "/private",
						element: <Private />,
					},
				],
			},
		],
	},
]);
export default router;

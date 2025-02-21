import { useContext } from "react";
import UserContext from "../contexts/userContext";
const Private = () => {
	const { userData } = useContext(UserContext);
	return (
		<div className="">
			<div className="text-center z-0">Welcome {userData?.username}</div>
		</div>
	);
};

export default Private;

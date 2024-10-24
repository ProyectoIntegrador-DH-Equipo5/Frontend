import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
	return (
		<Link to="/">
			<div className="flex justify-between items-center gap-2">
				<img src="/images/logo.png" className="w-full h-20" alt="Logo" />

				<h2 className="text-amber-400">Slogan</h2>
			</div>
		</Link>
	);
};

export default Logo;

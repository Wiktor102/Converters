import React from "react";
import "../scss/layout/Header.scss";

const Header = () => {
	return (
		<header>
			<div>
				<a href="https://wiktorgolicz.pl" className="home_icon">
					<i className="fas fa-home"></i>
				</a>
				<h1 className="logo">Przeliczniki</h1>
			</div>
		</header>
	);
};

export default Header;

/// <reference types="vite-plugin-svgr/client" />
import { NavLink, useNavigate } from 'react-router-dom';
import ArrowDropDown from '../assets/arrowdropdown.svg?react';

import useStore from '../stores';

function NavBar () {

	const navigate = useNavigate();
	
	const user = useStore((state) => state.user);
	const setUser = useStore((state) => state.setUser);

	const setWarning = useStore((state) => state.setWarning);

	const logout = () => {
		setUser({
			loggedIn: false,
			user: "",
			title: "",
			id: -1,
			pfp: "https://i.imgur.com/scPEALU.png",
			isAdmin: false,
			useTranslit: true,
			accessToken: ""
		});
		localStorage.setItem('accessToken', "");
		console.log("Logged out");
		setWarning({enabled: true, message: "You have logged out.", type: 0})
		navigate("/");
	}

	return (
		<>
			{user.loggedIn
				? <div className = "navbar">
					<div className = "navbar-group" id = "nb-left">
						<NavLink to = '/'><p>waffle timing league (ALPHA)</p></NavLink>
						<NavLink to = '/'><p>home</p></NavLink>
						<NavLink to = '/leaderboard'><p>leaderboard</p></NavLink>
						<NavLink to = '/charts'><p>charts</p></NavLink>
						<NavLink to = '/submit'><p>submit scores</p></NavLink>
						<NavLink to = {'/profile/' + user.id}><p>profile</p></NavLink>
					</div>
					<div className = "navbar-group" id = "nb-right">
						<div className = "navbar-usergroup">
							<img src = {user.pfp}></img>
							<div className = "dropdown">
								<div className = "dropdown-inner">
									<p>{user.user}</p>
									<ArrowDropDown />
								</div>
								<div className = "dropdown-content">
									<NavLink to = {'/settings'}><p>settings</p></NavLink>
									<p className = "txt-btn" onClick={logout}>logout</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				: 
				<div className = "navbar">
					<div className = "navbar-group" id = "nb-left">
						<NavLink to = '/'><p>waffle timing league (ALPHA)</p></NavLink>
						<NavLink to = '/'><p>home</p></NavLink>
						<NavLink to = '/leaderboard'><p>leaderboard</p></NavLink>
						<NavLink to = '/charts'><p>charts</p></NavLink>
					</div>
					<div className = "navbar-group" id = "nb-right">
						<NavLink to = '/register'><p>register</p></NavLink>
						<NavLink to = '/login'><p>login</p></NavLink>
					</div>
				</div>
			}
		</>
	)
}

export default NavBar;
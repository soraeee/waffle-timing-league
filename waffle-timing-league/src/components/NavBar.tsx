import { NavLink } from 'react-router-dom';

// todo show login or logout button depending on current state

function NavBar (props: any) {

	// TODO make this wipe the localstorage auth key
	function logout() {
		props.setLoginInfo({
			loggedIn: false,
			user: "",
			id: -1,
			accessToken: ""
		});
		localStorage.setItem('accessToken', "");
		console.log("Logged out");
	}

	return (
		<div className = "navbar">
			<p>wafl timing league logo</p>
			<NavLink to = '/'><p>home</p></NavLink>
			<NavLink to = '/scores'><p>scores</p></NavLink>
			<NavLink to = '/leaderboard'><p>leaderboard</p></NavLink>
			<NavLink to = '/submit'><p>submit scores</p></NavLink>
			{props.loginInfo.loggedIn
				? <p onClick={logout}>logout (this doesnt work)</p>
				: <NavLink to = '/login'><p>login</p></NavLink>
			}
		</div>
	)
}

export default NavBar;
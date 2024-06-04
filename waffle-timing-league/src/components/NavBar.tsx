import { NavLink, useNavigate } from 'react-router-dom';

// todo show login or logout button depending on current state

function NavBar (props: any) {

	const navigate = useNavigate();

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
		navigate("/");
	}

	return (
		<div className = "navbar">
			<p>wafl timing league logo</p>
			<NavLink to = '/'><p>home</p></NavLink>
			<NavLink to = '/leaderboard'><p>leaderboard</p></NavLink>
			{props.loginInfo.loggedIn
				? <>
					<NavLink to = '/submit'><p>submit scores</p></NavLink>
					<NavLink to = {'/profile/' + props.loginInfo.id}><p>profile</p></NavLink>
					<p onClick={logout}>logout</p>
				</>
				: <NavLink to = '/login'><p>login</p></NavLink>
			}
		</div>
	)
}

export default NavBar;
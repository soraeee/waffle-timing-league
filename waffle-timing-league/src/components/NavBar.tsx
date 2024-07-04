import { NavLink, useNavigate } from 'react-router-dom';

function NavBar (props: any) {

	const navigate = useNavigate();

	// TODO make this wipe the localstorage auth key
	const logout = () => {
		props.setLoginInfo({
			loggedIn: false,
			user: "",
			id: -1,
			pfp: "https://i.imgur.com/scPEALU.png",
			accessToken: ""
		});
		localStorage.setItem('accessToken', "");
		console.log("Logged out");
		props.setWarning({enabled: true, message: "You have logged out.", type: 0})
		navigate("/");
	}

	return (
		<>
			{props.loginInfo.loggedIn
				? <div className = "navbar">
					<div className = "navbar-group" id = "nb-left">
						<NavLink to = '/'><p>waffle timing league (ALPHA)</p></NavLink>
						<NavLink to = '/'><p>home</p></NavLink>
						<NavLink to = '/leaderboard'><p>leaderboard</p></NavLink>
						<NavLink to = '/charts'><p>charts</p></NavLink>
						<NavLink to = '/submit'><p>submit scores</p></NavLink>
						<NavLink to = {'/profile/' + props.loginInfo.id}><p>profile</p></NavLink>
					</div>
					<div className = "navbar-group" id = "nb-right">
						<div className = "navbar-usergroup">
							<img src = {props.loginInfo.pfp}></img>
							{/* TODO this should be a dropdown menu later */}
							<NavLink to = {'/profile/' + props.loginInfo.id}><p>{props.loginInfo.user}</p></NavLink>
						</div>
						<p onClick={logout}>logout</p>
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
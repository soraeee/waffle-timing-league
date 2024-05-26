import { NavLink } from 'react-router-dom';

function NavBar () {
	return (
		<div className = "navbar">
			<p>wafl timing league logo</p>
			<NavLink to = '/'><p>home</p></NavLink>
			<NavLink to = '/scores'><p>scores</p></NavLink>
			<NavLink to = '/leaderboard'><p>leaderboard</p></NavLink>
			<NavLink to = '/submit'><p>submit scores</p></NavLink>
		</div>
	)
}

export default NavBar;
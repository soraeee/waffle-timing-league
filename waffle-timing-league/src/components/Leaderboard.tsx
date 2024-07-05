import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function Leaderboard () {

	interface User {
		rank:				number;
		id:					number;
		username:			string;
		pfp:				string;
		points:				number;
		accuracy:			number;
	}

	const [leaderboard, setLeaderboard] = useState<User[]>([]);
	const [noEntries, setNoEntries] = useState<boolean>(false);

	const getUserList = () => {
		fetch(import.meta.env.VITE_API_URL + '/api/profile/getuserlist', {
			method: 'GET',
		})
		.then(response => {
			if (response.status == 404) setNoEntries(true); // Don't load the page if there are no users
			return response.text();
		})
		.then(data => {
			const obj = JSON.parse(data);
			let rank = 0;
			const parsedUsers: User[] = obj.users.map((user: any) => {
				rank += 1;
				return {
					rank:		rank,
					id:			user.id,
					username:	user.username,
					pfp:		user.pfp,
					points:		user.total_points,
					accuracy:	user.accuracy,
				}
			});
			setLeaderboard(parsedUsers);
		});
	}

	useEffect(() => {
		getUserList();
	}, [])

	return (
		<div className = "leaderboard">
			<p className = "leaderboard-title">Leaderboard</p>
			{!noEntries ? 
				<>
					{leaderboard.length > 0 
						? <div className = "leaderboard-list">
							{leaderboard.map((user) => {
								return(
									<div className = "leaderboard-list-row" key = {user.rank}>
										<div className = "leaderboard-list-row-user">
											<p>#{user.rank}</p>
											<img src = {user.pfp}></img>
											<NavLink to = {'/profile/' + user.id}><p>{user.username}</p></NavLink>
										</div>
										<div className = "leaderboard-list-row-stats">
											<p>{user.points} pts.</p>
											<p>{user.accuracy}%</p>
										</div>
									</div>
								)
							})}
						</div>
						: <div>
							<p>oopsie woopsie we're doing a littol loading :33333</p>
						</div>}
				</>
			: <p>No users found!</p>}
		</div>
	)
}

export default Leaderboard;
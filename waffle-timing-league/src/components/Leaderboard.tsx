import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function Leaderboard () {

	interface User {
		rank:				number;
		id:					number;
		username:			string;
		pfp:				string;
		points:				number;
	}

	const [leaderboard, setLeaderboard] = useState<User[]>([]);

	const getUserList = () => {
		fetch('http://localhost:3001/api/profile/getuserlist', {
			method: 'GET',
		})
		.then(response => {
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
							<p>{user.points}</p>
						</div>
					)
				})}
			</div>
			: <div>
				<p>oopsie woopsie we're doing a littol loading :33333</p>
			</div>}
		</div>
	)
}

export default Leaderboard;
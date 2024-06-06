import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProfilePage (props: any) {

	interface Score {
		id:					number; // score id?
		folderTitle:		string;	// dunno if artist/subtitle are super necessary rn, that can be handled on db side
		dpPercent:			number;

		w1:					number; // blue fant
		w2:					number;	// white fant
		w3:					number;	// excellent
		w4:					number;	// great
		w5:					number; // decent
		w6:					number;	// way off
		w7:					number;	// miss

		holdsHit:			number; // includes rolls
		minesHit:			number;
		date:				Date; 	// not sure if correct typing?
		uid:				number;	// user id of the uploader
	}

	interface User {
		id:					number;
		username:			string;
		pfp:				string;
		title:				string;
		points:				number;
		accuracy:			number;
		rank:				number;
	}

	const [scores, setScores] = useState<Score[]>([]);
	const [user, setUser] = useState<User>({
		id:			-1,
		username:	'lol',
		pfp:		'https://i.imgur.com/scPEALU.png',
		title:		'test title please ignore',
		points:		0,
		accuracy:	0.00,
		rank:		-1,
	});
	let params = useParams();
	
	const getScores = () => {
		fetch('http://localhost:3001/api/scores/getscores?id=' + params.id, {
			method: 'GET',
		})
		.then(response => {
			return response.text();
		})
		.then(data => {
			const obj = JSON.parse(data);
			const parsedScores: Score[] = obj.scores.map((score: any) => {
				return {
					id:				score.id,
					folderTitle:	score.title,
					dpPercent:		score.dp_percent,

					w1:				score.w1,
					w2:				score.w2,
					w3:				score.w3,
					w4:				score.w4,
					w5:				score.w5,
					w6:				score.w6,
					w7:				score.w7,

					holdsHit:		score.holds_hit,
					minesHit:		score.mines_hit,
					date:			new Date(score.date),
					uid:			score.user_id,
				}
			});
			//console.log(obj);
			setScores(parsedScores);
		});
	}

	const getUser = () => {
		fetch('http://localhost:3001/api/profile/getuser?id=' + params.id, {
			method: 'GET',
		})
		.then(response => {
			return response.text();
		})
		.then(data => {
			const obj = JSON.parse(data);
			setUser({
				id:			obj.id,
				username:	obj.username,
				pfp:		obj.pfp,
				title:		obj.title,
				points:		obj.totalPoints,
				accuracy:	obj.accuracy,
				rank:		obj.rank,
			})
		});
	}

	useEffect(() => {
		getScores();
		getUser();
	}, [])

	return (
		<>
			{(user.id != -1)
			? <>
				<div className = "profile-header">
					<div className = "profile-header-column-left">
						<div className = "profile-userinfo">
							<p className = "profile-username">{user.username}</p>
							<p className = "profile-title">{user.title}</p>
							<img src = {user.pfp} className = "profile-pfp"></img>
						</div>
					</div>
					<div className = "profile-header-column-right">
						<div className = "profile-stats">
							<p className = "profile-stats-title">rank</p>
							<p className = "profile-stats-value">#{user.rank}</p>
						</div>
						<div className = "profile-stats">
							<p className = "profile-stats-title">points</p>
							<p className = "profile-stats-value">{user.points}</p>
						</div>
						<div className = "profile-stats">
							<p className = "profile-stats-title">accuracy</p>
							<p className = "profile-stats-value">{user.accuracy}%</p>
						</div>
						<div className = "profile-stats">
							<p className = "profile-stats-title">plays</p>
							<p className = "profile-stats-value">69420</p>
						</div>
					</div>
				</div>
				<p>scores:</p>
				{scores.map((score) => {
					return (
						<div key = {score.id}>
							<p>{score.folderTitle}</p>
							<p>{score.dpPercent}%</p>
						</div>
					)
				})}
			</>
			
			: <>
				<p>Loading... (replace this later lol!)</p>
			</>}
		</>
	)
}

export default ProfilePage;
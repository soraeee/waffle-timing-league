import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";

function ProfilePage (props: any) {

	interface Score {
		id:					number; // score id?
		title:				string;	
		subtitle:			string;	
		titleTranslit:		string;	
		subtitleTranslit:	string;	
		artist:				string;	
		artistTranslit:		string;	
		difficulty:			number;

		dpPercent:			number;
		points:				number;

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
		rank:				number;	// score's rank relative to user's other scores
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

	interface SearchInput {
		search: string;
	}
	
	const { register, handleSubmit } = useForm<SearchInput>();

	const [validUser, setValidUser] = useState<boolean>(true);

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
					id:					score.id,
					title:				score.title,			
					subtitle:			score.subtitle,
					titleTranslit:		score.title_translit,	
					subtitleTranslit:	score.subtitle_translit,	
					artist:				score.artist,	
					artistTranslit:		score.artist_translit,
					difficulty:			score.difficulty,

					dpPercent:			score.dp_percent,
					points:				score.points,

					w1:					score.w1,
					w2:					score.w2,
					w3:					score.w3,
					w4:					score.w4,
					w5:					score.w5,
					w6:					score.w6,
					w7:					score.w7,

					holdsHit:			score.holds_hit,
					minesHit:			score.mines_hit,
					date:				new Date(score.date),
					uid:				score.user_id,
					rank:				score.ranking,
				}
			});
			console.log(obj);
			setScores(parsedScores);
		});
	}

	const getUser = () => {
		fetch('http://localhost:3001/api/profile/getuser?id=' + params.id, {
			method: 'GET',
		})
		.then(response => {
			if (response.status == 404) setValidUser(false); // Don't load the page when an invalid user is requested
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
		<> {validUser
			? <>
				{(user.id != -1)
				? <div className = "profile">
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
					<div className = "profile-scores">
						<div className = "profile-scores-header">
							<p className = "profile-scores-title">top plays</p>
							<form>
								<input
									className = "search-input"
									placeholder = "Search songs..."
									{...register("search")}
								/>
							</form>
						</div>
						<div className = "profile-scores-display">
							{scores.map((score) => {
								return (
									<div key = {score.id} className = "scorecard">
										<div className = "scorecard-rank">
											<p className = "scorecard-rank-text">{score.rank}</p>
										</div>
										<div className = "scorecard-difficulty">
											<p className = "scorecard-difficulty-text">
												{score.difficulty}
											</p>
										</div>
										<div className = "scorecard-inner">
											<div className = "scorecard-titlegroup">
												<p className = "scorecard-title">{score.title}</p>
												<p className = "scorecard-subtitle">{score.subtitle}</p>
											</div>
											<div className = "scorecard-stats">
												<div className = "scorecard-group">
													<p className = "scorecard-stats-text" id = "dp">{score.dpPercent}%</p>
												</div>
												<div className = "scorecard-group">
													<p className = "scorecard-stats-text" id = "points">{score.points} pts.</p>
												</div>
												<div className = "scorecard-group">
													<p className = "scorecard-stats-text" id = "date">{score.date.getMonth()}/{score.date.getDay()}/{score.date.getFullYear()}</p>
												</div>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
				
				: <>
					<p>Loading... (replace this later lol!)</p>
				</>}
			</>
			: <div>
				<p>Invalid user!</p>
			</div>
			}
		</>
	)
}

export default ProfilePage;
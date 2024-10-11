/// <reference types="vite-plugin-svgr/client" />

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";

import ScoreCard from './ScoreCard';

import ArrowDropDown from '../assets/arrowdropdown.svg?react';
import ArrowDropUp from '../assets/arrowdropup.svg?react';

import useStore from '../stores';

function ProfilePage () {
	
	const loginUser = useStore((state) => state.user);

	interface Score {
		id:					number; // score id?
		title:				string;	
		subtitle:			string;	
		titleTranslit:		string;	
		subtitleTranslit:	string;	
		artist:				string;	
		artistTranslit:		string;	
		difficulty:			number;
		slot:				string;

		dpPercent:			number;
		points:				number;

		w1:					number; // blue fant
		w2:					number;	// white fant
		w3:					number;	// excellent
		w4:					number;	// great
		w5:					number; // decent
		w6:					number;	// way off
		w7:					number;	// miss

		lamp:				number; // clear lamp

		holdsHit:			number; // includes rolls
		holdsTotal:			number; // includes rolls
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

	interface SortType {
		col: string;
		asc: boolean;
	}
	
	const { register, handleSubmit } = useForm<SearchInput>();

	const [validUser, setValidUser] = useState<boolean>(true);

	const [activeCard, setActiveCard] = useState<number>(-1);

	const [scores, setScores] = useState<Score[]>([]);
	const [displayedScores, setDisplayedScores] = useState<Score[]>([]);

	const [chartSort, setChartSort] = useState<SortType>({col: "dpPercent", asc: false});

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
		if (user.id != Number(params.id)) { // Prevent excessive query calls if the profile id doesn't chnage on rerender
			fetch(import.meta.env.VITE_API_URL + '/api/scores/getscores?id=' + params.id, {
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
						slot:				score.slot,

						dpPercent:			Number(score.dp_percent).toFixed(2),
						points:				score.points,

						w1:					score.w1,
						w2:					score.w2,
						w3:					score.w3,
						w4:					score.w4,
						w5:					score.w5,
						w6:					score.w6,
						w7:					score.w7,

						lamp:				score.lamp,

						holdsHit:			score.holds_hit,
						holdsTotal:			score.holds_rolls_count,
						minesHit:			score.mines_hit,
						date:				new Date(score.date),
						uid:				score.user_id,
						rank:				score.ranking,
					}
				});
				//console.log(obj);
				setScores(parsedScores);
				setDisplayedScores(parsedScores);
			});
		}
	}

	const getUser = () => {
		if (user.id != Number(params.id)) { // Prevent excessive query calls if the profile id doesn't chnage on rerender
			setUser({
				id:			-1,
				username:	'lol',
				pfp:		'https://i.imgur.com/scPEALU.png',
				title:		'test title please ignore',
				points:		0,
				accuracy:	0.00,
				rank:		-1,
			});
			fetch(import.meta.env.VITE_API_URL + '/api/profile/getuser?id=' + params.id, {
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
	}

	// Handle changing sort type
	const changeSort = (type: string) => {
		let curAsc: boolean = chartSort.asc;
		if (chartSort.col == type) {
			setChartSort({col: type, asc: !curAsc});
			curAsc = !curAsc;
		} else {
			setChartSort({col: type, asc: false});
			curAsc = false;
		}
		
		let scores: Score[] = displayedScores;
		console.log(scores);
		setDisplayedScores(
			scores.sort((a: Score, b: Score) => {
				let titleA = a["title"];
				let titleB = b["title"];
				if (a["titleTranslit"]) titleA = a["titleTranslit"];
				if (b["titleTranslit"]) titleB = b["titleTranslit"];
				// bruh
				if (curAsc) {
					switch (type) {
						case "title":			return titleA.localeCompare(titleB, undefined, { numeric: true });
						case "date":			return a["date"] < b["date"] ? -1 : 1;
						case "difficulty":		return a["difficulty"] - b["difficulty"];
						case "dpPercent":		return a["dpPercent"] - b["dpPercent"];
					}
				} else {
					switch (type) {
						case "title":			return titleB.localeCompare(titleA, undefined, { numeric: true });
						case "date":			return b["date"] < a["date"] ? -1 : 1;
						case "difficulty":		return b["difficulty"] - a["difficulty"];
						case "dpPercent":		return b["dpPercent"] - a["dpPercent"];
					}
				}
				return 1;
			})
		);
	}

	// Score search handler
	const onSubmit: SubmitHandler<SearchInput> = (data) => {
		const input: string = data.search.toLowerCase();
		const newScores: Score[] = scores.filter((score: Score) => {
			return (score.title.toLowerCase().includes(input)
					|| score.titleTranslit.toLowerCase().includes(input)
					|| score.subtitle.toLowerCase().includes(input)
					|| score.subtitleTranslit.toLowerCase().includes(input))
		});
		setDisplayedScores(newScores);
	}

	useEffect(() => {
		getScores();
		getUser();
		setActiveCard(-1);
	}, [params])

	/*useEffect(() => {
		sortScores();
	}, [chartSort])*/

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
								<p className = "profile-stats-value">[TBD]</p>
							</div>
						</div>
						{/*<div className = "profile-header-column-right">
							<div className = "profile-stats">
								<p className = "profile-stats-title">Quints</p>
								<p className = "profile-stats-value">123123</p>
							</div>
							<div className = "profile-stats">
								<p className = "profile-stats-title">Quads</p>
								<p className = "profile-stats-value">123123</p>
							</div>
							<div className = "profile-stats">
								<p className = "profile-stats-title">FECs</p>
								<p className = "profile-stats-value">123123</p>
							</div>
							<div className = "profile-stats">
								<p className = "profile-stats-title">FCs</p>
								<p className = "profile-stats-value">123123</p>
							</div>
							<div className = "profile-stats">
								<p className = "profile-stats-title">Clears</p>
								<p className = "profile-stats-value">123123</p>
							</div>
						</div>*/}
					</div>
					<div className = "profile-scores">
						<div className = "profile-scores-header">
							<p className = "profile-scores-title">top plays</p>
							<form className = "profile-scores-search" onSubmit = {handleSubmit(onSubmit)}>
								<input
									className = "search-input"
									placeholder = "Search songs..."
									{...register("search")}
								/>
								<input className = "search-btn" type = "submit" value = "Search"/>
							</form>
						</div>
						
						<div className = "profile-scores-display">
							{/* absolute fucking mess of a sort bar */}
							<div className = "profile-scores-display-header">
								<div className = "profile-scores-display-header-group" id = "header-rank">
									<p className = "profile-scores-display-header-text">Rank</p>
								</div>
								<div className = "profile-scores-display-header-group txt-btn" onClick = {() => changeSort("difficulty")}>
									<p className = "profile-scores-display-header-text" id = "header-diff">Diff</p>
									<div className = "sort-arrow-group">
										<ArrowDropUp className = {(chartSort.col == "difficulty" && chartSort.asc) ? "sort-arrow-up sort-arrow-active" : "sort-arrow-up"}/>
										<ArrowDropDown className = {(chartSort.col == "difficulty" && !chartSort.asc) ? "sort-arrow-down sort-arrow-active" : "sort-arrow-down"}/>
									</div>
								</div>
								<div className = "profile-scores-display-header-group txt-btn" onClick = {() => changeSort("title")}>
									<p className = "profile-scores-display-header-text">Title</p>
									<div className = "sort-arrow-group">
										<ArrowDropUp className = {(chartSort.col == "title" && chartSort.asc) ? "sort-arrow-up sort-arrow-active" : "sort-arrow-up"}/>
										<ArrowDropDown className = {(chartSort.col == "title" && !chartSort.asc) ? "sort-arrow-down sort-arrow-active" : "sort-arrow-down"}/>
									</div>
								</div>
								<div className = "profile-scores-display-header-group txt-btn" onClick = {() => changeSort("dpPercent")}>
									<p className = "profile-scores-display-header-text">EX %</p>
									<div className = "sort-arrow-group">
										<ArrowDropUp className = {(chartSort.col == "dpPercent" && chartSort.asc) ? "sort-arrow-up sort-arrow-active" : "sort-arrow-up"}/>
										<ArrowDropDown className = {(chartSort.col == "dpPercent" && !chartSort.asc) ? "sort-arrow-down sort-arrow-active" : "sort-arrow-down"}/>
									</div>
								</div>
								<div className = "profile-scores-display-header-group">
									<p className = "profile-scores-display-header-text">Points</p>
								</div>
								<div className = "profile-scores-display-header-group txt-btn" id = "header-date" onClick = {() => changeSort("date")}>
									<p className = "profile-scores-display-header-text">Date</p>
									<div className = "sort-arrow-group">
										<ArrowDropUp className = {(chartSort.col == "date" && chartSort.asc) ? "sort-arrow-up sort-arrow-active" : "sort-arrow-up"}/>
										<ArrowDropDown className = {(chartSort.col == "date" && !chartSort.asc) ? "sort-arrow-down sort-arrow-active" : "sort-arrow-down"}/>
									</div>
								</div>
							</div>

							{/* Display score cards */}
							{displayedScores.map((score, index) => {
								return (
									<ScoreCard 
										key = {index} 
										score = {score}
										index = {index}
										activeCard = {activeCard} 
										setActiveCard = {setActiveCard}
										useTranslit = {loginUser.useTranslit}
									/>
								)
							})}
							{displayedScores.length == 0
								? <p>No scores found :pensive:</p>
								: null
							}
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
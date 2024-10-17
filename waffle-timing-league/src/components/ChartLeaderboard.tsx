import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ArrowDropDown from '../assets/arrowdropdown.svg?react';
import ArrowDropUp from '../assets/arrowdropup.svg?react';

import ScoreCard from './ScoreCard';

import useStore from '../stores';

interface Chart {
	id:					number,

	title:				string,
	subtitle:			string,
	titleTranslit:		string,
	subtitleTranslit:	string,
	artist:				string,
	artistTranslit:		string,

	noteCount:			number,
	holdsTotal:			number,
	minesCount:			number,

	displaybpm1:		number,
	displaybpm2:		number,

	difficulty:			number,
	slot:				string,

	description:		string,
	credit:				string,
	noCmod:				boolean,
}

interface Score {
	id:					number,
	points:				number,
	dpPercent:			number,

	w1:					number,
	w2:					number,
	w3:					number,
	w4:					number,
	w5:					number,
	w6:					number,
	w7:					number,

	holdsHit:			number,
	minesHit:			number,
	holdsTotal:			number,

	lamp:				number,
	date:				Date,

	uid:				number,
	username:			string,
	rank:				number,
}

interface SortType {
	col: string;
	asc: boolean;
}

function ChartLeaderboard() {

	const user = useStore((state) => state.user);

	const [chart, setChart] = useState<Chart>({
			id:					-1,
		
			title:				'deez',
			subtitle:			'nuts',
			titleTranslit:		'desu',
			subtitleTranslit:	'nutsu',
			artist:				'youre mom',
			artistTranslit:		'tu mama',
		
			noteCount:			69,
			holdsTotal:			420,
			minesCount:			1337,
		
			displaybpm1:		100,
			displaybpm2:		200,
		
			difficulty:			1,
			slot:				'Challenge',
		
			description:		'example description',
			credit:				'example string',
			noCmod:				false,
	});

	const [validChart, setValidChart] = useState<boolean>(true);

	const [leaderboard, setLeaderboard] = useState<Score[]>([]);
	const [displayedLeaderboard, setDisplayedLeaderboard] = useState<Score[]>([]);
	
	const [activeCard, setActiveCard] = useState<number>(-1);
	
	const [scoreSort, setScoreSort] = useState<SortType>({col: "dpPercent", asc: false});

	let params = useParams();

	const changeSort = (type: string) => {
		let curAsc: boolean = scoreSort.asc;
		if (scoreSort.col == type) {
			setScoreSort({col: type, asc: !curAsc});
			curAsc = !curAsc;
		} else {
			setScoreSort({col: type, asc: false});
			curAsc = false;
		}
		
		let scores: Score[] = displayedLeaderboard;
		setDisplayedLeaderboard(
			scores.sort((a: Score, b: Score) => {
				// bruh
				if (curAsc) {
					switch (type) {
						case "username":		return a.username.localeCompare(b.username, undefined, { numeric: true });
						case "date":			return a["date"] < b["date"] ? -1 : 1;
						case "dpPercent":		return a["dpPercent"] - b["dpPercent"];
					}
				} else {
					switch (type) {
						case "username":		return b.username.localeCompare(a.username, undefined, { numeric: true });
						case "date":			return b["date"] < a["date"] ? -1 : 1;
						case "dpPercent":		return b["dpPercent"] - a["dpPercent"];
					}
				}
				return 1;
			})
		);
	}

	let diffClass: string = "chleaderboard-chartinfo-difficulty-block ";
	switch (chart.slot) {
		case 'Novice':		diffClass += ' diff-novice'; 	break;
		case 'Easy':		diffClass += ' diff-easy'; 		break;
		case 'Medium':		diffClass += ' diff-medium'; 	break;
		case 'Hard':		diffClass += ' diff-hard';		break;
		case 'Challenge':	diffClass += ' diff-expert';	break;
		case 'Edit':		diffClass += ' diff-edit'; 		break;
	}

	const getLeaderboard = () => {
		fetch(import.meta.env.VITE_API_URL + '/api/charts/getleaderboard?id=' + params.id, {
			method: 'GET',
		})
		.then(response => {
			if (response.status == 404) setValidChart(false); // Don't load the page when an invalid chart is requested
			return response.text();
		})
		.then(data => {
			const obj = JSON.parse(data);

			if (!obj.hasOwnProperty("message")) {
				// remove (Hard) (Medium) etc from title
				let parsedTitle = obj.chart.title;
				let parsedTitleTranslit = obj.chart.title_translit;
	
				parsedTitle = parsedTitle.replace("(Hard)", "");
				parsedTitle = parsedTitle.replace("(Medium)", "");
				parsedTitle = parsedTitle.replace("(Easy)", "");
				parsedTitle = parsedTitle.replace("(Novice)", "");
	
				parsedTitleTranslit = parsedTitleTranslit.replace("(Hard)", "");
				parsedTitleTranslit = parsedTitleTranslit.replace("(Medium)", "");
				parsedTitleTranslit = parsedTitleTranslit.replace("(Easy)", "");
				parsedTitleTranslit = parsedTitleTranslit.replace("(Novice)", "");
	
				// Honestly I should have just named my postgres columns better so I don't have to do this every time I want to access data lol
				const chart: Chart = {
					id:					obj.chart.id,
	
					title:				parsedTitle,
					subtitle:			obj.chart.subtitle,
					titleTranslit:		parsedTitleTranslit,
					subtitleTranslit:	obj.chart.subtitle_translit,
					artist:				obj.chart.artist,
					artistTranslit:		obj.chart.artist_translit,
	
					displaybpm1:		obj.chart.displaybpm1,
					displaybpm2:		obj.chart.displaybpm2,
	
					noteCount:			obj.chart.note_count,
					holdsTotal:			obj.chart.holds_rolls_count,
					minesCount:			obj.chart.mines_count,
	
					difficulty:			obj.chart.difficulty,
					slot:				obj.chart.slot,
	
					description:		obj.chart.description,
					credit:				obj.chart.credit,
					noCmod:				obj.chart.no_cmod,
				}
				setChart(chart);
	
				const scores: Score [] = obj.scores.map((score: any) => {
					return {
						id:				score.score_id,
						points:			score.points,
						dpPercent:		score.dp_percent,
	
						w1:				score.w1,
						w2:				score.w2,
						w3:				score.w3,
						w4:				score.w4,
						w5:				score.w5,
						w6:				score.w6,
						w7:				score.w7,
	
						holdsHit:		score.holds_hit,
						holdsTotal:		chart.holdsTotal,
						minesHit:		score.mines_hit,
	
						lamp:			score.lamp,
						date:			new Date(score.date),
	
						uid:			score.user_id,
						username:		score.username,
						rank:			score.ranking,
					}
				}) 
				setLeaderboard(scores);
				setDisplayedLeaderboard(scores);
			}
		});
	}

	useEffect(() => {
		getLeaderboard();
	}, [])
	return (
		<>
			{(validChart) ? <>
				{(chart.id != -1) ? <div className = "chleaderboard">
					<div className = "chleaderboard-chartinfo">
						<div className = "chleaderboard-chartinfo-left">
							<div className = "chleaderboard-chartinfo-title">
								<p className = "chleaderboard-chartinfo-title-text">{(user.useTranslit && chart.titleTranslit) ? chart.titleTranslit : chart.title}</p>
								{chart.subtitle ? <p className = "chleaderboard-chartinfo-title-subtext">{(user.useTranslit && chart.subtitleTranslit) ? chart.subtitleTranslit : chart.subtitle}</p> : null}
							</div>
							<div className = "chleaderboard-chartinfo-difficulty">
								<div className = "chleaderboard-chartinfo-difficulty-slot">
									<p className = "chleaderboard-chartinfo-difficulty-slot-text">{chart.slot}</p>
								</div>
								<div className = {diffClass}>
									<p className = "chleaderboard-chartinfo-difficulty-text">{chart.difficulty}</p>
								</div>
								{chart.noCmod ? <div className = "chleaderboard-chartinfo-nocmod">No CMOD</div> : null}
							</div>
						</div>
						
						<div className = "chleaderboard-chartinfo-right">
							<div className = "chleaderboard-chartinfo-meta">
								<p className = "chleaderboard-chartinfo-meta-title">BPM</p>
								{(chart.displaybpm1 == chart.displaybpm2) ? <p className = "chleaderboard-chartinfo-meta-text">{chart.displaybpm1}</p> : <p className = "chleaderboard-chartinfo-meta-text">{chart.displaybpm1} - {chart.displaybpm2}</p>}
							</div>
							<div className = "chleaderboard-chartinfo-meta">
								<p className = "chleaderboard-chartinfo-meta-title">Steps by</p>
								{(chart.credit) ? <p className = "chleaderboard-chartinfo-meta-text">{chart.credit}</p> : <p className = "chleaderboard-chartinfo-meta-text">{chart.description}</p>}
							</div>
						</div>
					</div>
					<div className = "chleaderboard-scores">
						<div className = "chleaderboard-scores-header">
							<div className = "chleaderboard-scores-header-group txt-btn">
								<p className = "chleaderboard-scores-header-text" id = "header-rank">Rank</p>
							</div>
							<div className = "chleaderboard-scores-header-group txt-btn" onClick = {() => changeSort("username")}>
								<p className = "chleaderboard-scores-header-text">Username</p>
								<div className = "sort-arrow-group">
									<ArrowDropUp className = {(scoreSort.col == "username" && scoreSort.asc) ? "sort-arrow-up sort-arrow-active" : "sort-arrow-up"}/>
									<ArrowDropDown className = {(scoreSort.col == "username" && !scoreSort.asc) ? "sort-arrow-down sort-arrow-active" : "sort-arrow-down"}/>
								</div>
							</div>
							<div className = "chleaderboard-scores-header-group txt-btn" onClick = {() => changeSort("dpPercent")}>
								<p className = "chleaderboard-scores-header-text">EX%</p>
								<div className = "sort-arrow-group">
									<ArrowDropUp className = {(scoreSort.col == "dpPercent" && scoreSort.asc) ? "sort-arrow-up sort-arrow-active" : "sort-arrow-up"}/>
									<ArrowDropDown className = {(scoreSort.col == "dpPercent" && !scoreSort.asc) ? "sort-arrow-down sort-arrow-active" : "sort-arrow-down"}/>
								</div>
							</div>
							<div className = "chleaderboard-scores-header-group txt-btn">
								<p className = "chleaderboard-scores-header-text">Points</p>
							</div>
							<div className = "chleaderboard-scores-header-group txt-btn" id = "header-date" onClick = {() => changeSort("date")}>
								<p className = "chleaderboard-scores-header-text">Date</p>
								<div className = "sort-arrow-group">
									<ArrowDropUp className = {(scoreSort.col == "date" && scoreSort.asc) ? "sort-arrow-up sort-arrow-active" : "sort-arrow-up"}/>
									<ArrowDropDown className = {(scoreSort.col == "date" && !scoreSort.asc) ? "sort-arrow-down sort-arrow-active" : "sort-arrow-down"}/>
								</div>
							</div>
						</div>
						{leaderboard.map((score, index) => {
							return (
								<ScoreCard 
									key = {index} 
									score = {score}
									index = {index}
									activeCard = {activeCard} 
									setActiveCard = {setActiveCard}
								/>
							)
						})}
						{leaderboard.length == 0
							? <p>No scores found :pensive:</p>
							: null
						}
					</div>
				</div>
				: <div>
					<p>pretend this is a loading animation (i will replace this later) (trust me)</p>
				</div>}
			</>
			: <div>
				<p>Invalid chart!</p>
			</div>}
		</>

	)
}

export default ChartLeaderboard;
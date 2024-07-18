import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import ArrowDropDown from '../assets/arrowdropdown.svg?react';
import ArrowDropUp from '../assets/arrowdropup.svg?react';
import BlockIcon from '../assets/block.svg?react';

interface userInfo {
	loggedIn: boolean,
	user: string,
	title: string,
	id: number,
	pfp: string,
	isAdmin: boolean,
	useTranslit: boolean,
	accessToken: string
}

interface IProps {
	loginInfo: userInfo;
}

interface Chart {
	id:					number,
	folderTitle:		string,
	title:				string,
	subtitle:			string,
	titleTranslit:		string,
	subtitleTranslit:	string,
	artist:				string,
	artistTranslit:		string,
	displaybpm1:		number,
	displaybpm2:		number,
	difficulty:			number,
	slot:				string,
	credit:				string,
	noCmod:				boolean,
}

interface SortType {
	col: string;
	asc: boolean;
}

function ChartsPage({ loginInfo }: IProps) {

	/* enum DifficultySlot {
		CHALLENGE = 0,
		HARD,
		MEDIUM,
		EASY,
		NOVICE,
		EDIT,
	} */


	const [charts, setCharts] = useState<Chart[]>([]);
	const [displayedCharts, setDisplayedCharts] = useState<Chart[]>([]);
	
	const [chartSort, setChartSort] = useState<SortType>({col: "difficulty", asc: true});

	const getCharts = () => {
		fetch(import.meta.env.VITE_API_URL + '/api/charts/getcharts', {
			method: 'GET',
		})
		.then(response => {
			return response.text();
		})
		.then(data => {
			const obj = JSON.parse(data);
			const chartsArr: Chart[] = obj.charts.map((chart: any) => {
				return {
					id:					chart.id,
					folderTitle:		chart.folder_title,
					title:				chart.title,
					subtitle:			chart.subtitle,
					titleTranslit:		chart.title_translit,
					subtitleTranslit:	chart.subtitle_translit,
					artist:				chart.artist,
					artistTranslit:		chart.artist_translit,
					displaybpm1:		chart.displaybpm1,
					displaybpm2:		chart.displaybpm2,
					difficulty:			chart.difficulty,
					slot:				chart.slot,
					credit:				chart.credit,
					noCmod:				chart.no_cmod,
				}
			});
			setCharts(chartsArr);
			setDisplayedCharts(chartsArr);
		});
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
		
		let charts: Chart[] = displayedCharts;
		setDisplayedCharts(
			charts.sort((a: Chart, b: Chart) => {
				let titleA = a["title"];
				let titleB = b["title"];
				if (a["titleTranslit"]) titleA = a["titleTranslit"];
				if (b["titleTranslit"]) titleB = b["titleTranslit"];
				// bruh
				if (curAsc) {
					switch (type) {
						case "title":			return titleA.localeCompare(titleB, undefined, { numeric: true });
						case "difficulty":		return a["difficulty"] - b["difficulty"];
					}
				} else {
					switch (type) {
						case "title":			return titleB.localeCompare(titleA, undefined, { numeric: true });
						case "difficulty":		return b["difficulty"] - a["difficulty"];
					}
				}
				return 1;
			})
		);
	}

	useEffect(() => {
		getCharts();
	}, []);

	return (
		<div className = "charts-list">
			<div className = "charts-list-container">
				<p className = "charts-list-title">Charts</p>
				<div className = "charts-list-cards">

					{/* Sort header */}
					<div className = "charts-list-header">
						<div className = "charts-list-header-group txt-btn" onClick = {() => changeSort("difficulty")}>
							<p className = "charts-list-header-text" id = "header-diff">Diff</p>
							<div className = "sort-arrow-group">
								<ArrowDropUp className = {(chartSort.col == "difficulty" && chartSort.asc) ? "sort-arrow-up sort-arrow-active" : "sort-arrow-up"}/>
								<ArrowDropDown className = {(chartSort.col == "difficulty" && !chartSort.asc) ? "sort-arrow-down sort-arrow-active" : "sort-arrow-down"}/>
							</div>
						</div>
						<div className = "charts-list-header-group txt-btn" onClick = {() => changeSort("title")}>
							<p className = "charts-list-header-text">Title</p>
							<div className = "sort-arrow-group">
								<ArrowDropUp className = {(chartSort.col == "title" && chartSort.asc) ? "sort-arrow-up sort-arrow-active" : "sort-arrow-up"}/>
								<ArrowDropDown className = {(chartSort.col == "title" && !chartSort.asc) ? "sort-arrow-down sort-arrow-active" : "sort-arrow-down"}/>
							</div>
						</div>
					</div>
					
					{/* Display charts */}
					{displayedCharts.map((chart: Chart) => {
						let diffClass: string = "charts-list-card-difficulty ";
						switch (chart.slot) {
							case 'Novice':		diffClass += ' diff-novice'; 	break;
							case 'Easy':		diffClass += ' diff-easy'; 		break;
							case 'Medium':		diffClass += ' diff-medium'; 	break;
							case 'Hard':		diffClass += ' diff-hard';		break;
							case 'Challenge':	diffClass += ' diff-expert';	break;
							case 'Edit':		diffClass += ' diff-edit'; 		break;
						}

						return (
							<NavLink to = {'/chart/' + chart.id} key = {chart.id} className = "charts-list-card">
								<div className={diffClass}>
									<p className="charts-list-card-difficulty-text">
										{chart.difficulty}
									</p>
								</div>
								<div className = "charts-list-card-titlegroup">
									<div className = "charts-list-card-titlegroup-inner">
										<p className = "charts-list-card-title">{(loginInfo.useTranslit && chart.titleTranslit) ? chart.titleTranslit : chart.title}</p>
										<p className = "charts-list-card-subtitle">{(loginInfo.useTranslit && chart.subtitleTranslit) ? chart.subtitleTranslit : chart.subtitle}</p>
									</div>
									{chart.noCmod ? <BlockIcon className = "charts-list-nocmod"/> : null}
								</div>
							</NavLink>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default ChartsPage;
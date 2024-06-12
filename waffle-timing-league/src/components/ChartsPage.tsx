
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ChartsPage() {

	/* enum DifficultySlot {
		CHALLENGE = 0,
		HARD,
		MEDIUM,
		EASY,
		NOVICE,
		EDIT,
	} */

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

	const [charts, setCharts] = useState<Chart[]>([]);

	const getCharts = () => {
		fetch('http://localhost:3001/api/charts/getcharts', {
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
					nocmod:				chart.no_cmod,
				}
			});
			console.log(chartsArr);
			setCharts(chartsArr);
		});
	}

	useEffect(() => {
		getCharts();
	}, []);

	return (
		<>
			{charts.map((chart: Chart) => {
				return (
					<div key = {chart.id}>
						<p>{chart.artist}</p>
						<p>{chart.title}</p>
						<p>{chart.subtitle}</p>
					</div>
				)
			})}
		</>
	)
}

export default ChartsPage;
import { useState, useEffect } from 'react';

import ScoreUpload from './ScoreUpload';

function ScoresPage () {

	// TODO: add user (for fkey for postgres db)
	interface Score {
		id:					number; // pkey i think
		title:				string;	// dunno if artist/subtitle are super necessary rn, that can be handled on db side

		w1:					number; // blue fant
		w2:					number;	// white fant
		w3:					number;	// excellent
		w4:					number;	// great
		w5:					number; // decent
		w6:					number;	// way off
		w7:					number;	// miss

		holdshit:			number; // includes rolls
		mineshit:			number;
		date:				string; // fuck it, we ball
	}

	const [scores, setScores] = useState<Score[]>([]);
	
	function getScores() {
		fetch('http://localhost:3001/api/scores/getscores')
		.then(response => {
			return response.text();
		})
		.then(data => {
			const obj: Score[] = JSON.parse(data);
			//console.log(obj);
			setScores(obj);
		});
	}

	useEffect(() => {
		getScores();
	}, [])

	return (
		<>
			<p>this is the scores page !</p>
			{scores.map((score) => {
				const dpGained: number = (score.w1 * 3.5) + (score.w2 * 3) + (score.w3 * 2) + (score.w4 * 1) + (score.holdshit * 1) - (score.mineshit * 1);
				const dpTotal: number = (+score.w1 + +score.w2 + +score.w3 + +score.w4 + +score.w5 + +score.w6 + +score.w7) * 3.5 + +score.holdshit; // java fucking script
				const dpPercent = (dpGained / dpTotal * 100).toFixed(2);
				return (
					<div key = {score.id}>
						<p>{score.title}</p>
						<p>{dpPercent}%</p>
					</div>
				)
			})}
		</>
	)
}

export default ScoresPage;
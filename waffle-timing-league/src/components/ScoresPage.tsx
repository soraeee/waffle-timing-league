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

		holdsHit:			number; // includes rolls
		minesHit:			number;
		date:				string; // fuck it, we ball
	}

	const [scores, setScores] = useState<Score[]>([]);
	
	function getScores() {
		fetch('http://localhost:3001')
		.then(response => {
			return response.text();
		})
		.then(data => {
			const obj = JSON.parse(data);
			console.log(obj);
			//setScores();
		});
	}

	useEffect(() => {
		getScores();
	}, []) // TODO: change dependency array so it only updates when state "scores" is updated

	return (
		<>
			<ScoreUpload getScores = {getScores}/>
		</>
	)
}

export default ScoresPage;
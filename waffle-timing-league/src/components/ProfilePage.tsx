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

	const [scores, setScores] = useState<Score[]>([]);
	let params = useParams();
	
	function getScores() {
		fetch('http://localhost:3001/api/scores/getscores?id=' + params.id, {
			method: 'GET',
		})
		.then(response => {
			return response.text();
		})
		.then(data => {
			const obj = JSON.parse(data);
			console.log(obj)
			const parsedScores: Score[] = obj.scores.map((score: any) => {
				return {
					id:				score.id,
					folderTitle:	score.folder_title,
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
			})
			setScores(parsedScores);
		});
	}

	useEffect(() => {
		getScores();
	}, [])

	return (
		<>
			<p>this is the scores page !</p>
			{scores.map((score) => {
				return (
					<div key = {score.id}>
						<p>{score.folderTitle}</p>
						<p>{score.dpPercent}%</p>
					</div>
				)
			})}
		</>
	)
}

export default ProfilePage;
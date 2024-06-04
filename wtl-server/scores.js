require('dotenv').config()
const db = require("./models");
const userdb = db.user;
const scoresdb = db.scores;
const chartsdb = db.charts;

// get scores
// TODO: probably include the rest of the chart metadata in each score too?
const getScores = (req, res) => {
	scoresdb.findAll({
		where: {
			user_id: req.query.id
		}
	}).then(data => {
		if (data.length == 0) {
			return res.status(404).send({ message: "No scores found." });
		}
		res.status(200).send({
			scores: data
		});
	})
}

// add score
// TODO: prob return the actual chart title instead of the folder title
// TODO: calc ranking points for the score, and also send the amount of RP gain through the response
// TODO: update cutoff date
const addScores = async (req, res) => {
	const uid = req.body[0].uid;
	let dateCutoff;

	let updatedScores = [];
	let scoresreq = req.body;

	try {
		// Get the user of the score, then get the date when they last submitted scores
		const user = await userdb.findByPk(uid);
		if (user === null) {
			return res.status(404).send({ message: "Invalid user id when submitting scores (this shouldn't happen lol)" });
		}
		dateCutoff = new Date(user.dataValues["last_submit_date"]);
		console.log(dateCutoff);

		// Parse through all scores in the request
		await Promise.all(scoresreq.map(async (score) => {
			const { id, folderTitle, w1, w2, w3, w4, w5, w6, w7, holdsHit, minesHit, date, uid } = score;
			console.log("Processing score " + folderTitle);
	
			// Check if the score was set before the last submitted date, and ignore if so
			if (date < dateCutoff) { // i hope this is how date compare works ! also probably technically impossible for date to equal the cutoff anyways
				console.log("Date for score for " + folderTitle + " is set before the date cutoff" );
				return;
			}

			// Check if notecount is correct, and that there aren't more holds/rolls or mines hit than there are in the chart
			// Also checks if the chart even exists in the tournament
			const scoreNotecount = (+w1 + +w2 + +w3 + +w4 + +w5 + +w6 + +w7)
			
			const curChart = await chartsdb.findOne({
				where: {
					folder_title: folderTitle
				}
			});
			if (!curChart) {
				console.log("Could not find a matching chart in chartdb when submitting a score for " + folderTitle + "???" );
				return;
			}
			if ((scoreNotecount != curChart.note_count) || (holdsHit > curChart.holds_rolls_count) || (minesHit > curChart.mines_count)) {
				console.log("Notecount (or holds/rolls/mine) for score for " + folderTitle + " does not match with the chart (recieved notecount: " + scoreNotecount + ", expected: " + curChart.note_count + ")");
				return
			}

			console.log("All checks passed for score " + folderTitle);

			// Check if there is a score that exists from this user for this chart
			let prevScorePercent = 0;
			const prevScore = await scoresdb.findOne({
				where: {
					user_id: uid,
					folder_title: folderTitle 
				}
			})
			const dpGained = (w1 * 3.5) + (w2 * 3) + (w3 * 2) + (w4 * 1) + (holdsHit * 1) - (minesHit * 1);
			const dpTotal = (+w1 + +w2 + +w3 + +w4 + +w5 + +w6 + +w7) * 3.5 + +curChart.holds_rolls_count;
			const dpPercent = Math.floor((dpGained / dpTotal * 100) * 100) / 100; // Round down to 2 decimal places
			if (prevScore) {
				// Update the already existing score if the new score is better
				prevScorePercent = prevScore.dp_percent;
				if (dpPercent > prevScore) {
					await scoresdb.update({
						dp_percent: 	dpPercent,
						w1:				w1,
						w2:				w2,
						w3:				w3,
						w4:				w4,
						w5:				w5,
						w6:				w6,
						w7:				w7,
						holds_hit:		holdsHit,
						mines_hit:		minesHit,
						date:			date,
					},
					{
						where: {					
							user_id: uid,
							folder_title: folderTitle
						}
					})
					updatedScores.push({
						folderTitle: folderTitle,
						scoreDiff: dpPercent - prevScorePercent,
					})
				} else {
					console.log("Score for " + folderTitle + " is worse or equal to the existing score");
				}
				return;
			}

			// Create a new score
			await scoresdb.create({
				folder_title: 	folderTitle,
				dp_percent: 	dpPercent,
				w1:				w1,
				w2:				w2,
				w3:				w3,
				w4:				w4,
				w5:				w5,
				w6:				w6,
				w7:				w7,
				holds_hit:		holdsHit,
				mines_hit:		minesHit,
				date:			date,
				user_id:		uid,
			});
			updatedScores.push({
				folderTitle: folderTitle,
				scoreDiff: dpPercent,
			})
			console.log(updatedScores);
		}))

		// Send response after all scores are processed
		console.log(JSON.stringify(updatedScores));
		res.status(200).send({
			updates: updatedScores
		})
		console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
	} catch {
		res.status(500).send({ message: err.message });
	}
}

module.exports = {
	getScores,
	addScores,
};
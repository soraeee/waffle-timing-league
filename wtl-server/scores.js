require('dotenv').config()
const db = require("./models");
const { QueryTypes } = require('sequelize');
const userdb = db.user;
const scoresdb = db.scores;
const chartsdb = db.charts;
const sequelize = db.sequelize;

// get scores
// TODO: probably include the rest of the chart metadata in each score too?
/*const getScores = (req, res) => {
	scoresdb.findAll({
		where: {
			user_id: req.query.id
		},
	}).then(data => {
		if (data.length == 0) {
			return res.status(404).send({ message: "No scores found." });
		}
		res.status(200).send({
			scores: data
		});
	})
}*/
const getScores = (req, res) => {
	sequelize.query(`select 
		scores.id,
		charts.title,
		scores.dp_percent,
		scores.user_id,
		charts.subtitle,
		charts.title_translit,
		charts.subtitle_translit,
		charts.artist,
		charts.artist_translit,
		charts.difficulty,
		charts.slot
		from scores as scores
		inner join charts as charts on
		scores.folder_title = charts.folder_title
		where user_id = :id`,
	{
		replacements: {id: req.query.id},
		type: QueryTypes.SELECT
	},
	).then((data) => {
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
const addScores = async (req, res) => {
	const uid = req.body[0].uid;
	let dateCutoff;

	// Previous values for comparison later
	let oldAcc;
	let oldPoints;

	let updatedScores = [];
	let scoresreq = req.body;

	// Precalc log base
	const base = 1 / Math.log(1.1032889141348);

	try {
		// Get the user of the score, then get the date when they last submitted scores
		const user = await userdb.findByPk(uid);
		console.log(uid);
		console.log(user);
		if (user === null) {
			return res.status(404).send({ message: "Invalid user id when submitting scores (this shouldn't happen lol)" });
		}
		dateCutoff = new Date(user.dataValues["last_submit_date"]);
		oldAcc = user.accuracy;
		oldPoints = user.total_points;

		// Parse through all scores in the request
		for (const score of scoresreq) {
			const { folderTitle, w1, w2, w3, w4, w5, w6, w7, holdsHit, minesHit, cmod, date, uid } = score;
			console.log("Processing score " + folderTitle);

			// for of loops won't let me have guard clauses because javascript is cringe and using Promise.all/map creates a race condition
			let checks = true;
	
			// Check if the score was set before the last submitted date, and ignore if so
			// Not sure if this is necessary actually, the function works perfectly as is, and the date cutoff is never actually set
			if (date < dateCutoff) { // i hope this is how date compare works ! also probably technically impossible for date to equal the cutoff anyways
				console.log("Date for score for " + folderTitle + " is set before the date cutoff" );
				checks = false;
			}

			// Check if notecount is correct, and that there aren't more holds/rolls or mines hit than there are in the chart
			// Also checks if the chart even exists in the tournament
			const scoreNotecount = (+w1 + +w2 + +w3 + +w4 + +w5 + +w6 + +w7);	
			const curChart = await chartsdb.findOne({
				where: {
					folder_title: folderTitle
				}
			});
			if (!curChart) {
				console.log("Could not find a matching chart in chartdb when submitting a score for " + folderTitle + "???" );
				checks = false;
			}
			if ((scoreNotecount != curChart.note_count) || (holdsHit > curChart.holds_rolls_count) || (minesHit > curChart.mines_count)) {
				console.log("Notecount (or holds/rolls/mine) for score for " + folderTitle + " does not match with the chart (recieved notecount: " + scoreNotecount + ", expected: " + curChart.note_count + ")");
				checks = false;
			}

			// Ignore score if cmod was used on a No CMOD chart
			if (curChart.no_cmod && cmod) {
				console.log("Score for " + folderTitle + " used CMOD but chart is marked as No CMOD")
				checks = false;
			}

			// Do the real score processing
			if (checks) {
				console.log("All checks passed for score " + folderTitle);

				// Check if there is a score that exists from this user for this chart
				let prevScorePercent = 0;
				const prevScore = await scoresdb.findOne({
					where: {
						user_id: uid,
						folder_title: folderTitle 
					}
				});

				// Calc EX %
				const dpGained = (w1 * 3.5) + (w2 * 3) + (w3 * 2) + (w4 * 1) + (holdsHit * 1) - (minesHit * 1);
				const dpTotal = (+w1 + +w2 + +w3 + +w4 + +w5 + +w6 + +w7) * 3.5 + +curChart.holds_rolls_count;
				const dpPercent = Math.floor((dpGained / dpTotal * 100) * 100) / 100; // Round down to 2 decimal places

				// Calc points (based on ITL 2023+ curve)
				// see https://www.desmos.com/calculator/8lntrdswpu
				const chartPtValue = 1000 // if need be, can change this to be dependent on the chart being played, but for this event every chart is 1k
				const pts = Math.round(((Math.pow(61, Math.max(0, dpPercent - 50)/50)) + (Math.log(Math.min(dpPercent, 50) + 1) * base) - 1) / 100 * chartPtValue);

				if (prevScore != null) {
					// Update the already existing score if the new score is better
					prevScorePercent = prevScore.dp_percent;
					prevScorePoints = prevScore.points;
					if (dpPercent > prevScorePercent) {
						await scoresdb.update({
							dp_percent: 	dpPercent,
							points: 		pts,
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
							title: curChart.title,
							scoreDiff: dpPercent - prevScorePercent,
							pointsDiff: pts - prevScorePoints,
						})
					} else {
						console.log("Score for " + folderTitle + " is worse or equal to the existing score");
					}
				} else {
					// Create a new score
					await scoresdb.create({
						folder_title: 	folderTitle,
						dp_percent: 	dpPercent,
						points:		 	pts,
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
						title: curChart.title,
						scoreDiff: dpPercent,
						pointsDiff: pts,
					});
				};
				//console.log(updatedScores);
			}
		};

		// Calculate new accuracy and point count
		let scoreCount = 0;
		let totalPercent = 0;
		let newPoints = 0;
		const allScores = await scoresdb.findAll({
			where: {
				user_id: uid
			}
		});
		allScores.map((score) => {
			scoreCount += 1;
			totalPercent += +score.dataValues["dp_percent"];
			newPoints += +score.dataValues["points"];
		});
		const newAcc = Math.floor(totalPercent / scoreCount * 100) / 100;
		await userdb.update({
			accuracy: newAcc,
			total_points: newPoints,
		},
		{
			where: {
				id: uid
			}
		});

		// Send response after all scores are processed
		res.status(200).send({
			updates: updatedScores,
			accDiff: newAcc - oldAcc,
			pointsDiff: newPoints - oldPoints,
		})
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
}

module.exports = {
	getScores,
	addScores,
};
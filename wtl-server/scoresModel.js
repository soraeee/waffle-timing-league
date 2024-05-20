require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool({
	user: process.env.PG_USER,
	host: 'localhost',
	database: 'wtl',
	password: process.env.PG_PASSWORD,
	port: 5432,
});

// get scores
const getScores = async () => {
	try {
		return await new Promise(function (resolve, reject) {
			pool.query("SELECT * FROM scores", (error, results) => {
				if (error) {
					reject(error);
				}
				if (results && results.rows) {
					resolve(results.rows);
				} else {
					reject(new Error("No results found"));
				}
			});
		});
	} catch (error_1) {
		console.error(error_1);
		throw new Error("Internal server error");
	}
};

// add score
const addScores = (body) => {
	return new Promise(function (resolve, reject) {
		body.forEach((score) => {
			const { id, title, w1, w2, w3, w4, w5, w6, w7, holdsHit, minesHit, date } = score;
			pool.query(
				"INSERT INTO scores (title, w1, w2, w3, w4, w5, w6, w7, holdshit, mineshit, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
				[title, w1, w2, w3, w4, w5, w6, w7, holdsHit, minesHit, date],
				(error, results) => {
					if (error) {
						reject(error);
						console.log(score);
						console.log(error);
					}
					if (results && results.rows) {
						resolve(
							`A new score has been added: ${JSON.stringify(results.rows[0])}`
						);
					} else {
						reject(new Error("No results found"));
					}
				}
			);
		})
	});
};

module.exports = {
	getScores,
	addScores,
};
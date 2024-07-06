require('dotenv').config()
const { QueryTypes } = require('sequelize');
const db = require("./models");
const auth = require('./auth');
const userdb = db.user;
const sequelize = db.sequelize;

const getPublicUserInfo = (req, res) => {
	sequelize.query(
		`SELECT * from (
			SELECT 
				id,
				username,
				pfp,
				title,
				total_points,
				accuracy,
			RANK () OVER ( 
				ORDER BY total_points DESC
			) ranking
			from users
		) as ranked_users
		WHERE id = :id;`, // oh no
		{
			replacements: {id: req.query.id},
			type: QueryTypes.SELECT
		},
	).then(data => {
		const user = data[0];
		if (!user) {
			return res.status(404).send({ message: "User not found." });
		}
		res.status(200).send({
			id: user.id,
			username: user.username,
			pfp: user.pfp,
			title: user.title,
			totalPoints: user.total_points,
			accuracy: user.accuracy,
			rank: Number(user.ranking),
		});
	})
	.catch(err => {
		res.status(500).send({ message: err.message });
	});
}

const getUserList = (req, res) => {
	userdb.findAll({
		order: [['total_points', 'DESC']],
		attributes: ['id', 'username', 'total_points', 'pfp', 'title', 'accuracy']
	}).then(data => {
		if (data.length == 0) {
			return res.status(404).send({ message: "No users found." });
		}
		res.status(200).send({
			users: data
		});
	})
}

const changeSettings = (req, res) => {
	let token = req.headers["x-access-token"];
	if (auth.verifyToken(token, req.body.uid)) {
		if (req.body.title.length <= 30) { // max 30 chars title
			userdb.update({
				pfp:		req.body.pfp,
				title:		req.body.title,
				translit:	req.body.useTranslit,
			},
			{
				where: {
					id: req.body.uid
				}
			})
			.then((data) => {
				res.status(200).send({ message: "User data updated successfully!"});
			})
			.catch(err => {
				console.log(err.message);
				res.status(500).send({ message: err.message });
			});
		} else {
			return res.status(400).send({ message: "Title cannot be longer than 30 characters!" });
		}
	} else {
		return res.status(401).send({ message: "Invalid auth token!" });
	}
}

module.exports = {
	getPublicUserInfo,
	getUserList,
	changeSettings,
}
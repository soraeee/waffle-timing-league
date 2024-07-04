require('dotenv').config()
const { QueryTypes } = require('sequelize');
const db = require("./models");
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

module.exports = {
	getPublicUserInfo,
	getUserList,
}
require('dotenv').config()
const db = require("./models");
const userdb = db.user;

const getPublicUserInfo = (req, res) => {
	userdb.findOne({
		where: {
			id: req.query.id
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send({ message: "User not found." });
		}
		res.status(200).send({
			id: user.id,
			username: user.username,
			pfp: user.pfp,
			totalPoints: user.total_points,
		});
	})
	.catch(err => {
		res.status(500).send({ message: err.message });
	});
}

const getUserList = (req, res) => {
	userdb.findAll({
		order: [['total_points', 'DESC']],
		attributes: ['id', 'username', 'total_points', 'pfp']
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
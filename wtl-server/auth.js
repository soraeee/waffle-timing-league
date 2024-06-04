require('dotenv').config()
const db = require("./models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const roles = db.roles;
const userdb = db.user;

// const op = db.sequelize.Op;

const checkDuplicateUsername = (req, res, next) => {
	userdb.findOne({
		where: {
			username: req.body.username
		}
	}).then(user => {
		if (user) {
			res.status(400).send({
				message: "Failed! Username is already in use!"
			});
			return;
		}
		next();
	});
};

const verifyToken = (req, res, next) => {
	let token = req.headers["x-access-token"];

	if (!token) {
		return res.status(403).send({
			message: "No token provided!"
		});
	}

	jwt.verify(token,
		process.env.JWT_SECRET,
		(err, decoded) => {
			if (err) {
				return res.status(401).send({
					message: "Unauthorized!",
				});
			}
			req.userId = decoded.id;
			next();
		});
};

// Return user info based on a JWT token
const getUserInfo = (req, res) => {
	let token = req.headers["x-access-token"];

	jwt.verify(token,
		process.env.JWT_SECRET,
		(err, decoded) => {
			if (err) {
				console.log(err);
				return res.status(401).send({
					message: "Not a valid token",
				});
			}
			req.userId = decoded.id;
			userdb.findOne({
				where: {
					id: req.userId
				}
			}).then(user => {
				if (!user) {
					return res.status(404).send({ message: "User not found." });
				}
	
				res.status(200).send({
					id: user.id,
					username: user.username,
					isAdmin: user.isAdmin,
					accessToken: token
				});
			})
			.catch(err => {
				res.status(500).send({ message: err.message });
			});
		});
}

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

const signup = (req, res) => {
	userdb.create({
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password, 8),
		last_submit_date: new Date("2000-01-01T00:00:00"),
		total_points: 0,
		isAdmin: false,
	})
		.then(res.send({ message: "User was registered successfully!" }))
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};

// TODO replace this with passport.js probably
const signin = (req, res) => {
	userdb.findOne({
		where: {
			username: req.body.username
		}
	})
		.then(user => {
			if (!user) {
				return res.status(404).send({ message: "User not found." });
			}

			var passwordIsValid = bcrypt.compareSync(
				req.body.password,
				user.password
			);

			if (!passwordIsValid) {
				return res.status(401).send({
					accessToken: null,
					message: "Invalid Password!"
				});
			}

			const token = jwt.sign({ id: user.id },
				process.env.JWT_SECRET,
				{
					algorithm: 'HS256',
					allowInsecureKeySizes: true,
					expiresIn: 86400, // 24 hours
				});

				res.status(200).send({
					id: user.id,
					username: user.username,
					isAdmin: user.isAdmin,
					accessToken: token
				});
		})
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};

module.exports = {
	checkDuplicateUsername,
	verifyToken,
	signup,
	signin,
	getUserInfo,
	getPublicUserInfo,
};
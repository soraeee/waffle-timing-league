require('dotenv').config()
const db = require("./models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const roles = db.roles;
const user = db.user;

// const op = db.sequelize.Op;

const checkDuplicateUsername = (req, res, next) => {
	// Username
	user.findOne({
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

// do i really need this?
/*checkRolesExisted = (req, res, next) => {
	if (req.body.roles) {
		for (let i = 0; i < req.body.roles.length; i++) {
			if (!roles.includes(req.body.roles[i])) {
				res.status(400).send({
					message: "Failed! Role does not exist = " + req.body.roles[i]
				});
				return;
			}
		}
	}

	next();
};*/

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

const signup = (req, res) => {
	// Save User to Database
	user.create({
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	})
		.then(user => {
			// default to "user" role
			user.setRoles([1]).then(() => {
				res.send({ message: "User was registered successfully!" });
			});
		})
		.catch(err => {
			res.status(500).send({ message: err.message });
		});
};

const signin = (req, res) => {
	user.findOne({
		where: {
			username: req.body.username
		}
	})
		.then(user => {
			if (!user) {
				return res.status(404).send({ message: "User Not found." });
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

			var authorities = [];
			user.getRoles().then(roles => {
				for (let i = 0; i < roles.length; i++) {
					authorities.push("ROLE_" + roles[i].name.toUpperCase());  // what?
				}
				res.status(200).send({
					id: user.id,
					username: user.username,
					email: user.email,
					roles: authorities,
					accessToken: token
				});
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
};
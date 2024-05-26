const express = require('express');
const Sequelize = require("sequelize");
const app = express();
const cors = require("cors");
const port = 3001;

const scores = require('./scores');
const auth = require('./auth');

const corsOptions = {
	origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

const db = require("./models");
const role = db.role;

// This can be reworked later to just do `db.sequelize.sync()`
/*db.sequelize.sync({ force: true }).then(() => {
	console.log('Drop and Resync Db');
	initial();
});*/
db.sequelize.sync();

function initial() {
	role.create({
		id: 1,
		name: "user"
	});

	role.create({
		id: 2,
		name: "moderator"
	});
}

app.use(express.json());
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
	next();
});

// Auth routes
app.post("/api/auth/signup", [auth.checkDuplicateUsername], auth.signup);

app.post("/api/auth/signin", auth.signin);

const userBoard = (req, res) => { // Temp, should probably be moved to auth.js as "checkLoggedIn" and invoked on frontend when user attempts to access page requiring login
	res.status(200).send("User Content.");
};

app.get("/api/test/user", [auth.verifyToken], userBoard);

// Scores routes
app.get('/api/scores/getscores', (req, res) => {
	scores.getScores()
		.then(response => {
			res.status(200).send(response);
		})
		.catch(error => {
			res.status(500).send(error);
		})
})

app.post('/api/scores/addscores', (req, res) => {
	scores.addScores(req.body)
		.then(response => {
			res.status(200).send(response);
		})
		.catch(error => {
			res.status(500).send(error);
		})
})

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})
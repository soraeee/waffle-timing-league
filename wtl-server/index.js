const express = require('express');
const Sequelize = require("sequelize");
const app = express();
const cors = require("cors");
const port = 3001;

const scores = require('./scores');
const charts = require('./charts');
const auth = require('./auth');
const users = require('./users');

const corsOptions = {
	origin: "http://localhost:5173"
};

app.use(cors(corsOptions));

const db = require("./models");

db.sequelize.sync({ alter: true }).then(() => {
	//charts.createCharts(); // COMMENT OUT AFTER FIRST RUN
});

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

app.get("/api/auth/getuser", auth.getUserInfo);

// User routes
app.get("/api/profile/getuser", users.getPublicUserInfo);
app.get("/api/profile/getuserlist", users.getUserList);

/*const userBoard = (req, res) => { // Temp, should probably be moved to auth.js as "checkLoggedIn" and invoked on frontend when user attempts to access page requiring login
	res.status(200).send("User Content.");
};

app.get("/api/test/user", [auth.verifyToken], userBoard);*/

// Scores routes
app.get('/api/scores/getscores', scores.getScores);
app.post('/api/scores/addscores', scores.addScores);

// Chart routes
app.get('/api/charts/getcharts', charts.getCharts);

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})
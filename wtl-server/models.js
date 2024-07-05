const config = require("./db.config.js");

const { DataTypes } = require('sequelize');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
	config.database,
	config.user,
	config.password,
	{
		logging: false,

		host: config.host,
		dialect: config.dialect,
		pool: {
			max: config.pool.max,
			min: config.pool.min,
			acquire: config.pool.acquire,
			idle: config.pool.idle
		}
	}
);

// Auth/profile models
const user = sequelize.define("users", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	username: {
		type: DataTypes.STRING
	},
	email: {
		type: DataTypes.STRING
	},
	password: {
		type: DataTypes.STRING
	},
	last_submit_date: {
		type: DataTypes.DATE
	},

	total_points: {
		type: DataTypes.INTEGER
	},
	accuracy: {
		type: DataTypes.DECIMAL,
		defaultValue: 0.00,
	},

	pfp: {
		type: DataTypes.STRING,
		defaultValue: "https://i.imgur.com/scPEALU.png" // dorrie
	},
	title: {
		type: DataTypes.STRING,
		defaultValue: "WTL Participant"
	},

	translit: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},

	isAdmin: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	}
});

// Score/chart models
const charts = sequelize.define("charts", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},

	folder_title: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	subtitle: {
		type: DataTypes.STRING,
	},
	title_translit: {
		type: DataTypes.STRING,
	},
	subtitle_translit: {
		type: DataTypes.STRING,
	},
	artist: {
		type: DataTypes.STRING,
	},
	artist_translit: {
		type: DataTypes.STRING,
	},

	displaybpm1: {
		type: DataTypes.DECIMAL,
	},
	displaybpm2: {
		type: DataTypes.DECIMAL,
	},

	difficulty: {
		type: DataTypes.INTEGER,
	},
	slot: {
		type: DataTypes.STRING,
	},
	note_count: {
		type: DataTypes.INTEGER,
	},
	holds_rolls_count: {
		type: DataTypes.INTEGER,
	},
	mines_count: {
		type: DataTypes.INTEGER,
	},
	description: {
		type: DataTypes.STRING,
	},
	credit: {
		type: DataTypes.STRING,
	},
	chartname: {
		type: DataTypes.STRING,
	},

	no_cmod: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	}
});

const scores = sequelize.define("scores", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	folder_title: {
		type: DataTypes.STRING,
		allowNull: false,
		references: {
			model: charts,
			key: 'folder_title',
		}
	},

	dp_percent: {
		type: DataTypes.DECIMAL,
	},
	points: {
		type: DataTypes.INTEGER,
	},

	w1: {
		type: DataTypes.INTEGER,
	},
	w2: {
		type: DataTypes.INTEGER,
	},
	w3: {
		type: DataTypes.INTEGER,
	},
	w4: {
		type: DataTypes.INTEGER,
	},
	w5: {
		type: DataTypes.INTEGER,
	},
	w6: {
		type: DataTypes.INTEGER,
	},
	w7: {
		type: DataTypes.INTEGER,
	},
	holds_hit: {
		type: DataTypes.INTEGER,
	},
	mines_hit: {
		type: DataTypes.INTEGER,
	},

	lamp: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},

	date: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: user,
			key: 'id',
		}
	},
});

user.hasMany(scores, {
	foreignKey: 'user_id',
});
scores.belongsTo(user, {
	foreignKey: 'user_id',
});

charts.hasMany(scores, {
	foreignKey: 'folder_title',
});
scores.belongsTo(charts, {
	foreignKey: 'folder_title',
});

module.exports = {
	sequelize,

	user,

	scores,
	charts,
};
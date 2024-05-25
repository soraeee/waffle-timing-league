const config = require("./db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
	config.database,
	config.user,
	config.password,
	{
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

const user = sequelize.define("users", {
	username: {
		type: Sequelize.STRING
	},
	password: {
		type: Sequelize.STRING
	}
});

const role = sequelize.define("roles", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING
	}
});

user.belongsToMany(role, {
	through: "user_roles"
});

role.belongsToMany(user, {
	through: "user_roles"
});

const roles = ["user", "admin"];

module.exports = {
	sequelize,
	user,
	role,
	roles
};
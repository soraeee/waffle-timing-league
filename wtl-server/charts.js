require('dotenv').config()
const db = require("./models");
const pack = require("./pack.json");

const chartsdb = db.charts;
const sequelize = db.sequelize;
const { QueryTypes } = require('sequelize');

// Should be only run once after truncating the charts table (probably will add duplicate charts if you run it more than once)
const createCharts = () => {
	pack.charts.forEach(chart => {
		let cr = chart.difficulties[0].credit;
		let cn = chart.difficulties[0].chartname;
		if (cr === null) cr = "";
		if (cn === null) cn = "";

		// Remove extra metadata in title (typically point/block numbers)
		const newtitle = chart.title.split("] ");
		const newtitletl = chart.titletranslit.split("] ");

		chartsdb.create({
			folder_title: 		chart.folderName,
			title:				newtitle[newtitle.length - 1],
			subtitle:			chart.subtitle,
			title_translit:		newtitletl[newtitletl.length - 1],
			subtitle_translit:	chart.subtitletranslit,
			artist:				chart.artist,
			artist_translit:	chart.artisttranslit,

			displaybpm1:		chart.displaybpm[0],
			displaybpm2:		chart.displaybpm[1],

			difficulty:			chart.difficulties[0].difficulty,
			slot:				chart.difficulties[0].slot,
			note_count:			chart.difficulties[0].notecount,
			holds_rolls_count:	chart.difficulties[0].holdsrollscount,
			mines_count:		chart.difficulties[0].minescount,
			description:		chart.difficulties[0].description,
			credit:				cr,
			chartname:			cn,
		})
	})
}

const getCharts = (req, res) => {
	chartsdb.findAll({
		order: [['difficulty', 'ASC']]
	})
	.then((data) => {
		if (data.length == 0) {
			return res.status(404).send({ message: "No charts found." });
		}
		res.status(200).send({
			charts: data
		});
	})
}

const getChartLeaderboard = async (req, res) => {
	try {
		const chart = await chartsdb.findOne({
			where: {
				id: req.query.id
			}
		})
		const scores = await sequelize.query(`
			select 
				s.id as score_id,
				s.folder_title,
				s.points,
				s.dp_percent,
				s.w1,
				s.w2,
				s.w3,
				s.w4,
				s.w5,
				s.w6,
				s.w7,

				s.holds_hit,
				s.mines_hit,

				s.lamp,
				s.date,
				s.user_id,

				u.username,
				(case when s.points is not null
					then rank () over ( 
						order by points desc NULLS LAST
					)
				end) as ranking
				from scores as s
				right join users as u on u.id = s.user_id
				where s.folder_title = :title
		`,
		{
			replacements: {title: chart.folder_title},
			type: QueryTypes.SELECT
		},)
		res.status(200).send({
			chart: chart,
			scores: scores
		})
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
}

module.exports = {
	createCharts,
	getCharts,
	getChartLeaderboard,
};
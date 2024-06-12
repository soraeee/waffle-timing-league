require('dotenv').config()
const db = require("./models");
const pack = require("./pack.json");

const chartsdb = db.charts;

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
	chartsdb.findAll()
	.then((data) => {
		if (data.length == 0) {
			return res.status(404).send({ message: "No charts found." });
		}
		res.status(200).send({
			charts: data
		});
	})
}

module.exports = {
	createCharts,
	getCharts,
};
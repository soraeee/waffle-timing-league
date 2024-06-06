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
		chartsdb.create({
			folder_title: 		chart.folderName,
			title:				chart.title,
			subtitle:			chart.subtitle,
			title_translit:		chart.titletranslit,
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

module.exports = {
	createCharts,
};
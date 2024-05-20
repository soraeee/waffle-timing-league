import { useState, useCallback, useEffect } from 'react'

import ScoreParser from './ScoreParser';

import xmlJs from 'xml-js';
import Dropzone from 'react-dropzone';

// todo scrap this and just parse from stats.xml

function ScoreUpload() {

	const [statsFile, setStatsFile] = useState<any>(''); // typescript does not like filereader
	const [parsedStats, setParsedStats] = useState<Score[]>([]);

	interface Score {
		id:					number; // score id?
		title:				string;	// dunno if artist/subtitle are super necessary rn, that can be handled on db side

		w1:					number; // blue fant
		w2:					number;	// white fant
		w3:					number;	// excellent
		w4:					number;	// great
		w5:					number; // decent
		w6:					number;	// way off
		w7:					number;	// miss

		holdsHit:			number; // includes rolls
		minesHit:			number;
		date:				Date; 	// not sure if correct typing?
	}

	// Read and parse the stats file
	const readXML = async(path: any): Promise<any> => {
        await fetch(path)
            .then((response) => response.text())
            .then((xmlText) => {
                const dataObj: any = xmlJs.xml2js(xmlText, { compact: true });
                console.log("Done reading");

				let tournamentScores: Score[] = [];
				const scores: any = dataObj["Stats"]["SongScores"]["Song"];
				let scoreId = 0; // temp, this is stupid
				scores.map((song: any) => {
					// Check if song is in the correct pack
					// TODO: Change this to "Waffle Timing League"
					if (song["_attributes"]["Dir"].includes("ITL Online 2024")) {
						const title: string = song["_attributes"]["Dir"].split("/")[2];
						console.log(song["_attributes"]["Dir"]);
						console.log(song["Steps"]["HighScoreList"]["HighScore"]);

						const score = song["Steps"]["HighScoreList"]["HighScore"]
						if (score) {
							if (Array.isArray(score)) {
								tournamentScores.push({
									id: scoreId,
									title: title,

									w1: score[0]["TapNoteScores"]["W1"]["_text"] - score[0]["Score"]["_text"], // thanks itgmania
									w2: score[0]["Score"]["_text"],
									w3: score[0]["TapNoteScores"]["W2"]["_text"],
									w4: score[0]["TapNoteScores"]["W3"]["_text"],
									w5: score[0]["TapNoteScores"]["W4"]["_text"],
									w6: score[0]["TapNoteScores"]["W5"]["_text"],
									w7: score[0]["TapNoteScores"]["Miss"]["_text"],

									holdsHit: score[0]["HoldNoteScores"]["Held"]["_text"],
									minesHit: score[0]["TapNoteScores"]["HitMine"]["_text"],
									date: score[0]["DateTime"]["_text"],
								});
							} else {
								tournamentScores.push({
									id: scoreId,
									title: title,

									w1: score["TapNoteScores"]["W1"]["_text"] - score["Score"]["_text"], // thanks itgmania
									w2: score["Score"]["_text"],
									w3: score["TapNoteScores"]["W2"]["_text"],
									w4: score["TapNoteScores"]["W3"]["_text"],
									w5: score["TapNoteScores"]["W4"]["_text"],
									w6: score["TapNoteScores"]["W5"]["_text"],
									w7: score["TapNoteScores"]["Miss"]["_text"],

									holdsHit: score["HoldNoteScores"]["Held"]["_text"],
									minesHit: score["TapNoteScores"]["HitMine"]["_text"],
									date: score["DateTime"]["_text"],
								});
							}
						}
					}
					scoreId = scoreId += 1 // this is temp and stupid but i might keep it so react doesnt yell at me for children without unique keys
				})
				setParsedStats(tournamentScores);
				//console.log(scores);
            })
            .catch((error) => {
                console.error('Error fetching XML data:', error);
            });
    }

	// Handle file reading of the stats file
	const handleChange = useCallback((acceptedFiles: any) => {
		acceptedFiles.forEach((file: File) => {
			const reader = new FileReader();

			reader.onabort = () => console.log('file reading was aborted');
			reader.onerror = () => console.log('file reading has failed');
			reader.onload = () => {
				const dataUrl = reader.result;
				console.log("help")
				readXML(dataUrl);
			}
			reader.readAsDataURL(file);
		});
	}, []);

	return (
		<>
			<div>
				<Dropzone onDrop={acceptedFiles => handleChange(acceptedFiles)}>
					{({ getRootProps, getInputProps }) => (
						<section>
							<div className="title-screen-dropzone" {...getRootProps()}>
								<input {...getInputProps()} />
								<p className="title-screen-text-info">Import a Stats.xml here!</p>
							</div>
						</section>
					)}
				</Dropzone>

				{parsedStats.map((score) => {
					const dpGained: number = (score.w1 * 3.5) + (score.w2 * 3) + (score.w3 * 2) + (score.w4 * 1) + (score.holdsHit * 1) - (score.minesHit * 1);
					const dpTotal: number = (+score.w1 + +score.w2 + +score.w3 + +score.w4 + +score.w5 + +score.w6 + +score.w7) * 3.5 + +score.holdsHit; // java fucking script
					const dpPercent = (dpGained / dpTotal * 100).toFixed(2);
					return (
						<div key = {score.id}>
							<p>{score.title}</p>
							<p>{score.id}</p>
							<p>{dpPercent}</p>
						</div>
					)
				})}
			</div>
		</>
	)
}

export default ScoreUpload

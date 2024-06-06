import { useState, useCallback } from 'react'

import xmlJs from 'xml-js';
import Dropzone from 'react-dropzone';

function ScoreUpload(props: any) {

	const [parsedStats, setParsedStats] = useState<Score[]>([]);

	interface Score {
		folderTitle:		string;	// dunno if artist/subtitle are super necessary rn, that can be handled on db side

		w1:					number; // blue fant
		w2:					number;	// white fant
		w3:					number;	// excellent
		w4:					number;	// great
		w5:					number; // decent
		w6:					number;	// way off
		w7:					number;	// miss

		holdsHit:			number; // includes rolls
		minesHit:			number;

		cmod:				boolean; // was cmod used?

		date:				Date; 	// not sure if correct typing?
		uid:				number;	// user id of the uploader
	}

	// Read and parse the stats file
	const readXML = async(path: any): Promise<any> => {
        await fetch(path)
            .then((response) => response.text())
            .then((xmlText) => {
                const dataObj: any = xmlJs.xml2js(xmlText, { compact: true });
                //console.log("Done reading");

				let tournamentScores: Score[] = [];
				const scores: any = dataObj["Stats"]["SongScores"]["Song"];
				scores.map((song: any) => {
					// Check if song is in the correct pack
					// TODO: Change this to "Waffle Timing League"
					if (song["_attributes"]["Dir"].includes("_wtl demo")) {
						const title: string = song["_attributes"]["Dir"].split("/")[2];
						//console.log(song["_attributes"]["Dir"]);
						//console.log(song["Steps"]["HighScoreList"]["HighScore"]);

						const score = song["Steps"]["HighScoreList"]["HighScore"];
						if (score) {
							if (Array.isArray(score)) { // Check if there are multiple scores attributed to one chart
								score.forEach((sc) => {
									if (sc["Grade"]["_text"] != "Failed") {
										tournamentScores.push({
											folderTitle: title,

											w1: sc["TapNoteScores"]["W1"]["_text"] - sc["Score"]["_text"], // thanks itgmania
											w2: sc["Score"]["_text"],
											w3: sc["TapNoteScores"]["W2"]["_text"],
											w4: sc["TapNoteScores"]["W3"]["_text"],
											w5: sc["TapNoteScores"]["W4"]["_text"],
											w6: sc["TapNoteScores"]["W5"]["_text"],
											w7: sc["TapNoteScores"]["Miss"]["_text"],

											holdsHit: sc["HoldNoteScores"]["Held"]["_text"],
											minesHit: sc["TapNoteScores"]["HitMine"]["_text"],

											cmod: sc["Modifiers"]["_text"].startsWith('C'),

											date: sc["DateTime"]["_text"],
											uid: props.loginInfo.id,
										});
									}
								})
							} else {
								if (score["Grade"]["_text"] != "Failed") {
									tournamentScores.push({
										folderTitle: title,

										w1: score["TapNoteScores"]["W1"]["_text"] - score["Score"]["_text"], // thanks itgmania
										w2: score["Score"]["_text"],
										w3: score["TapNoteScores"]["W2"]["_text"],
										w4: score["TapNoteScores"]["W3"]["_text"],
										w5: score["TapNoteScores"]["W4"]["_text"],
										w6: score["TapNoteScores"]["W5"]["_text"],
										w7: score["TapNoteScores"]["Miss"]["_text"],

										holdsHit: score["HoldNoteScores"]["Held"]["_text"],
										minesHit: score["TapNoteScores"]["HitMine"]["_text"],

										cmod: score["Modifiers"]["_text"].startsWith('C'),

										date: score["DateTime"]["_text"],
										uid: props.loginInfo.id,
									});
								}
							}
						}
					}
				})

				fetch('http://localhost:3001/api/scores/addscores', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(tournamentScores),
					})
					.then(response => {
						return response.text();
					})
					.then(data => {
						console.log(data);
				});

				//setParsedStats(tournamentScores);
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
				//console.log("help")
				readXML(dataUrl);
			}
			reader.readAsDataURL(file);
		});
	}, []);

	return (
		<>
			{props.loginInfo.loggedIn
				? <div>
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
				</div>
				: <div>
					<p>You are not logged in!</p>
				</div>
			}
		</>
	)
}

export default ScoreUpload

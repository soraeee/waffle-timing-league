import { useState, useCallback } from 'react'

import xmlJs from 'xml-js';
import Dropzone from 'react-dropzone';

interface userInfo {
	loggedIn: boolean,
	user: string,
	title: string,
	id: number,
	pfp: string,
	isAdmin: boolean,
	useTranslit: boolean,
	accessToken: string
}

interface IProps {
	loginInfo: userInfo;
}

function ScoreUpload({ loginInfo }: IProps) {

	const [processState, setProcessState] = useState<number>(0); // 0 - default, 1 - loading, 2 - recieved updates
	const [scoreUpdates, setScoreUpdates] = useState<Update[]>([]);
	const [profileUpdates, setProfileUpdates] = useState<number[]>([0, 0]); // points, acc

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

	interface Update {
		title:				string,
		scoreDiff:			number,
		pointsDiff:			number,
	}

	// Read and parse the stats file
	const readXML = async(path: any): Promise<any> => {
        await fetch(path)
            .then((response) => response.text())
            .then((xmlText) => {
                const dataObj: any = xmlJs.xml2js(xmlText, { compact: true });
                //console.log("Done reading");

				let tournamentScores: Score[] = [];
				let scores: any = dataObj["Stats"]["SongScores"]["Song"];
				if (!Array.isArray(scores)) {
					scores = [scores];
				}
				scores.map((song: any) => {
					// Check if song is in the correct pack
					if (song["_attributes"]["Dir"].includes("Waffle Timing League")) {
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
											uid: loginInfo.id,
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
										uid: loginInfo.id,
									});
								}
							}
						}
					}
				})
				
				setProcessState(1);
				fetch(import.meta.env.VITE_API_URL + '/api/scores/addscores', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-access-token': loginInfo.accessToken,
					},
					body: JSON.stringify(tournamentScores),
					})
					.then(response => {
						return response.text();
					})
					.then(data => {
						console.log(data);
						const obj = JSON.parse(data);
						setScoreUpdates(obj.updates);
						setProfileUpdates([obj.pointsDiff, Math.floor(obj.accDiff * 100) / 100]);
						setProcessState(2);
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
	}, [loginInfo.id]);

	return (
		<div className = "submit-container">
			<div className = "submit-container-inner">
				<p className = "submit-container-title">Upload Scores</p>
				<p className = "submit-container-info">Your Stats.xml can be found at [ITGM install location]\Save\LocalProfiles\[profile number]</p>
			</div>
			{loginInfo.loggedIn
				? <div>
					{processState === 0 
						// default
						? <Dropzone onDrop={acceptedFiles => handleChange(acceptedFiles)}>
							{({ getRootProps, getInputProps }) => (
								<div className = "score-dropzone">
									<div className="score-dropzone-inner" {...getRootProps()}>
										<input {...getInputProps()} />
										<p className="score-dropzone-info">Drag and drop your Stats.xml here to submit scores!</p>
									</div>
								</div>
							)}
						</Dropzone>
						: <>
							{processState === 1 
								// loading
								? <div>
									our server monkeys are processing yo'ure score ...
								</div>

								// updates received
								: <div> 
									{scoreUpdates.map((update: Update) => {
										return (
											<div>
												<p>{update.title}</p>
												<p>+{Math.floor(update.scoreDiff * 100) / 100}%</p>
												<p>+{update.pointsDiff} pts.</p>
											</div>
										)
									})}
									<div> {/* TODO style/color these differently*/}
										{profileUpdates[1] >= 0
											? <p>Accuracy: +{profileUpdates[1]}%</p>
											: <p>Accuracy: {profileUpdates[1]}%</p>}
										<p>Points: +{profileUpdates[0]}</p>
									</div>
								</div>
							}
						</>
					}
				</div>
				: <div>
					<p>You are not logged in!</p>
				</div>
			}
		</div>
	)
}

export default ScoreUpload

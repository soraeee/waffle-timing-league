// Used for ProfilePage.tsx
interface ProfileScore {
	id:					number; // score id?
	title:				string;	
	subtitle:			string;	
	titleTranslit:		string;	
	subtitleTranslit:	string;	
	artist:				string;	
	artistTranslit:		string;	
	difficulty:			number;
	slot:				string;

	dpPercent:			number;
	points:				number;

	w1:					number; // blue fant
	w2:					number;	// white fant
	w3:					number;	// excellent
	w4:					number;	// great
	w5:					number; // decent
	w6:					number;	// way off
	w7:					number;	// miss

	lamp:				number; // clear lamp

	holdsHit:			number; // includes rolls
	holdsTotal:			number; // includes rolls
	minesHit:			number;

	date:				Date; 	// not sure if correct typing?
	uid:				number;	// user id of the uploader
	rank:				number;	// score's rank relative to user's other scores
}

// Used for ChartLeaderboard.tsx
interface ChartScore {
	id:					number,
	points:				number,
	dpPercent:			number,

	w1:					number,
	w2:					number,
	w3:					number,
	w4:					number,
	w5:					number,
	w6:					number,
	w7:					number,

	holdsHit:			number,
	minesHit:			number,
	holdsTotal:			number,
	lamp:				number,
	date:				Date,

	uid:				number,
	username:			string,
	rank:				number,
}

interface IProps {
	score: 			ProfileScore | ChartScore;
	index: 			number;
	activeCard:		any;
	setActiveCard:	any;
	useTranslit?:	boolean;
}

function ScoreCard({score, index, activeCard, setActiveCard, useTranslit}: IProps) {

	// Distinguish between scores on profile page vs chart leaderboard
	const isProfileScore = (object: any): object is ProfileScore => {
		return 'title' in object;
	}

	let lampClass: string = "scorecard-lamp";
	switch (score.lamp) {
		case null:
		case 0:		lampClass += ' lamp-noplay'; 	break;
		case 1:		lampClass += ' lamp-clear'; 	break;
		case 2:		lampClass += ' lamp-fc'; 		break;
		case 3:		lampClass += ' lamp-fec';		break;
		case 4:		lampClass += ' lamp-quad';		break;
		case 5:		lampClass += ' lamp-quint'; 	break;
	}

	let parsedTitle = "";
	let parsedTitleTranslit = "";
	let diffClass: string = "scorecard-difficulty ";
	
	if (isProfileScore(score)) {
		switch (score.slot) {
			case 'Novice':		diffClass += ' diff-novice'; 	break;
			case 'Easy':		diffClass += ' diff-easy'; 		break;
			case 'Medium':		diffClass += ' diff-medium'; 	break;
			case 'Hard':		diffClass += ' diff-hard';		break;
			case 'Challenge':	diffClass += ' diff-expert';	break;
			case 'Edit':		diffClass += ' diff-edit'; 		break;
		}
		
		// bruh
		parsedTitle = score.title;
		parsedTitleTranslit = score.titleTranslit;

		parsedTitle = parsedTitle.replace("(Hard)", "");
		parsedTitle = parsedTitle.replace("(Medium)", "");
		parsedTitle = parsedTitle.replace("(Easy)", "");
		parsedTitle = parsedTitle.replace("(Novice)", "");

		parsedTitleTranslit = parsedTitleTranslit.replace("(Hard)", "");
		parsedTitleTranslit = parsedTitleTranslit.replace("(Medium)", "");
		parsedTitleTranslit = parsedTitleTranslit.replace("(Easy)", "");
		parsedTitleTranslit = parsedTitleTranslit.replace("(Novice)", "");
	}

	const toggleActive = () => {
		if (activeCard == index) {
			setActiveCard(-1);
		} else {
			setActiveCard(index);
		}
	}

	return (
		<div className = "scorecard-wrapper">
			{isProfileScore(score) ?
				<div key={score.id} className="scorecard" onClick = {toggleActive}>
					{/* Profile page score card */}
					<div className="scorecard-rank">
						{score.rank != null
							? <p className="scorecard-rank-text">{score.rank}</p>
							: <p className="scorecard-rank-text">-</p>
						}
					</div>
					<div className = {lampClass}></div>
					<div className= {diffClass}>
						<p className="scorecard-difficulty-text">
							{score.difficulty}
						</p>
					</div>
					<div className="scorecard-titlegroup">
						<p className="scorecard-title">{(useTranslit && parsedTitleTranslit) ? parsedTitleTranslit : parsedTitle}</p>
						<p className="scorecard-subtitle">{(useTranslit && score.subtitleTranslit) ? score.subtitleTranslit : score.subtitle}</p>
					</div>
					
					<div className="scorecard-group">
						{score.rank != null
							? <p className="scorecard-stats-text" id="dp">{score.dpPercent}%</p>
							: <p className="scorecard-stats-text" id="dp">-%</p>
						}
					</div>
					
					<div className="scorecard-group">
						{score.rank != null
							? <p className="scorecard-stats-text" id="points">{score.points} pts.</p>
							: <p className="scorecard-stats-text" id="points">- pts.</p>
						}
					</div>
					
					<div className="scorecard-group">
						{score.rank != null
							? <p className="scorecard-stats-text" id="date">{score.date.getMonth()+1}/{score.date.getDay()}/{score.date.getFullYear()}</p>
							: <p className="scorecard-stats-text" id="date">-/-/-</p>
						}
					</div>
				</div>
				
				: <div key={score.id} className="chartscorecard" onClick = {toggleActive}> 
					{/* Chart page score card */}
					<div className="scorecard-rank">
						<p className="scorecard-rank-text">{score.rank}</p>
					</div>
					<div className = {lampClass}></div>
					<div className="scorecard-group">
						<p className = "chartscorecard-username-text">{score.username}</p>
					</div>
					
					<div className="scorecard-group">
						<p className="scorecard-stats-text" id="dp">{score.dpPercent}%</p>
					</div>
					
					<div className="scorecard-group">
						<p className="scorecard-stats-text" id="points">{score.points} pts.</p>
					</div>
					
					<div className="scorecard-group">
						<p className="scorecard-stats-text" id="date">{score.date.getMonth()+1}/{score.date.getDate()}/{score.date.getFullYear()}</p>
					</div>
				</div>
			}

			
			{activeCard == index 
			? <div className = "scorecard-details">
				<div className = "scorecard-details-judges">
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-fa">Fa+</p>
						<p>{score.w1 != null ? score.w1 : "-"}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-wfa">Fa</p>
						<p>{score.w2 != null ? score.w2 : "-"}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-ex">Ex</p>
						<p>{score.w3 != null ? score.w3 : "-"}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-gr">Gr</p>
						<p>{score.w4 != null ? score.w4 : "-"}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-de">De</p>
						<p>{score.w5 != null ? score.w5 : "-"}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-wo">Wo</p>
						<p>{score.w6 != null ? score.w6 : "-"}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-mi">Mi</p>
						<p>{score.w7 != null ? score.w7 : "-"}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title">Ho+Ro</p>
						<p>{score.holdsHit != null ? score.holdsHit : "-"}/{score.holdsTotal}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title">Mines</p>
						<p>{score.minesHit != null ? score.minesHit : "-"}</p>
					</div>
				</div>
			</div>
			: null
			}
		</div>
	)
}

export default ScoreCard;
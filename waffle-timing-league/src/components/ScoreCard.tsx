interface Score {
	id:					number; // score id?
	title:				string;	
	subtitle:			string;	
	titleTranslit:		string;	
	subtitleTranslit:	string;	
	artist:				string;	
	artistTranslit:		string;	
	difficulty:			number;

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

interface IProps {
	score: 			Score;
	index: 			Number;
	activeCard:		any;
	setActiveCard:	any;
}

function ScoreCard({score, index, activeCard, setActiveCard}: IProps) {

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

	const toggleActive = () => {
		if (activeCard == index) {
			setActiveCard(-1);
		} else {
			setActiveCard(index);
		}
	}

	return (
		<div className = "scorecard-wrapper">
			<div key={score.id} className="scorecard" onClick = {toggleActive}>
				<div className="scorecard-rank">
					{score.rank != null
						? <p className="scorecard-rank-text">{score.rank}</p>
						: <p className="scorecard-rank-text">-</p>
					}
				</div>
				<div className = {lampClass}></div>
				<div className="scorecard-difficulty">
					<p className="scorecard-difficulty-text">
						{score.difficulty}
					</p>
				</div>
				<div className="scorecard-titlegroup">
					<p className="scorecard-title">{score.title}</p>
					<p className="scorecard-subtitle">{score.subtitle}</p>
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
						? <p className="scorecard-stats-text" id="date">{score.date.getMonth()}/{score.date.getDay()}/{score.date.getFullYear()}</p>
						: <p className="scorecard-stats-text" id="date">-/-/-</p>
					}
				</div>
			</div>
			
			{activeCard == index 
			? <div className = "scorecard-details">
				<div className = "scorecard-details-judges">
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-fa">Fa+</p>
						<p>{score.w1}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-wfa">Fa</p>
						<p>{score.w2}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-ex">Ex</p>
						<p>{score.w3}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-gr">Gr</p>
						<p>{score.w4}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-de">De</p>
						<p>{score.w5}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-wo">Wo</p>
						<p>{score.w6}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title jud-mi">Mi</p>
						<p>{score.w7}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title">Ho+Ro</p>
						<p>{score.holdsHit}/{score.holdsTotal}</p>
					</div>
					<div className = "scorecard-details-judges-group">
						<p className = "scorecard-details-judges-title">Mines</p>
						<p>{score.minesHit}</p>
					</div>
				</div>
			</div>
			: null
			}
		</div>
	)
}

export default ScoreCard;
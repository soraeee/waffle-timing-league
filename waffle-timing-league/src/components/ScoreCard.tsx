function ScoreCard({score}: any) {

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

	return (
		<div key={score.id} className="scorecard">
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
			<div className="scorecard-inner">
				<div className="scorecard-titlegroup">
					<p className="scorecard-title">{score.title}</p>
					<p className="scorecard-subtitle">{score.subtitle}</p>
				</div>
				<div className="scorecard-stats">
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
							: <p className="scorecard-stats-text" id="points">-/-/-</p>
						}

					</div>
				</div>
			</div>
		</div>
	)
}

export default ScoreCard;
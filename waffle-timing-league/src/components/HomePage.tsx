function HomePage () {

	return (
		<div className = "home">
			<p className = "home-title">welcome to the WTL alpha!</p>
			<div className = "home-paragraph">
				<p className = "home-text">many features have yet to be developed, or are planned to undergo change at some point.</p>
				<p className = "home-text">as such, everything you currently see is <span className = "home-bold">subject to change!</span></p>
				<p className = "home-text"><span className = "home-bold">this especially includes the pack!</span></p>
			</div>
			<div className = "home-paragraph">
				<p className = "home-text">the purpose of this alpha is to test the infrastructure, and to make sure core event functions work properly.</p>
				<p className = "home-text">if there are any bugs or suggestions, please open an issue on the <a className = "link" href = "https://github.com/soraeee/waffle-timing-league/">GitHub</a> or DM sorae on discord directly!</p>
			</div>
			<div className = "home-paragraph">
				<p className = "home-text">get started by downloading the pack <a className = "link" href = "https://drive.google.com/file/d/18AZiSQVpsa7hYaFb9Ux6YS2_pGiXGbLq/view?usp=sharing">here</a>, and creating an account.</p>
				<p className = "home-text">submit scores by uploading your stats.xml while logged in.</p>
				<p className = "home-text">(manual/individual score submission will be added later)</p>
			</div>
			<div className = "home-paragraph">
				<p className = "home-text"><span className = "home-important"><a className = "link" href = "https://drive.google.com/file/d/18AZiSQVpsa7hYaFb9Ux6YS2_pGiXGbLq/view?usp=sharing">pack download</a></span></p>
			</div>
			<div className = "home-paragraph">
				<p className = "home-text"><span className = "home-bold home-important">comparisons to ITL</span></p>
				<p className = "home-text">all charts are now worth 1000 points max, regardless of block level or technicality.</p>
				<p className = "home-text">all charts are factored into your scoring, unlike ITL2023/2024 where only your top 75 counted.</p>
				<p className = "home-text">the score curve is the same as ITL2023/2024 (may change in the future).</p>
				<p className = "home-text">the final pack will be around 100-150 charts, with no unlocks.</p>
			</div>
			<div className = "home-paragraph">
				<p className = "home-text"><span className = "home-bold home-important">roadmap of things to add later:</span></p>
				<p className = "home-text">actual home page</p>
				<p className = "home-text">more feedback popups</p>
				<p className = "home-text">manual score submission/score deletion</p>
				<p className = "home-text">a real charts page, and individual chart leaderboard pages</p>
				<p className = "home-text">transliteration switch, editable titles (and a settings page in general)</p>
				<p className = "home-text">restyle leaderboards page</p>
			</div>
		</div>
	)
}

export default HomePage;
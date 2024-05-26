import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScoresPage from './components/ScoresPage';
import HomePage from './components/HomePage';
import ScoreUpload from './components/ScoreUpload';
import Leaderboard from './components/Leaderboard';
import NavBar from './components/NavBar';

function App() {
	return (
		<div className = "main">
			<NavBar />
		</div>
	)
}

export default App

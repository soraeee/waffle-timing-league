import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './scss/main.scss';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScoresPage from './components/ScoresPage';
import HomePage from './components/HomePage';
import ScoreUpload from './components/ScoreUpload';
import Leaderboard from './components/Leaderboard';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>

		<BrowserRouter>
			<App />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/leaderboard" element={<Leaderboard />} />
				<Route path="/submit" element={<ScoreUpload />} />
				<Route path="/scores" element={<ScoresPage />} /> {/* needs to be "/scores/:id" later*/}
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
)

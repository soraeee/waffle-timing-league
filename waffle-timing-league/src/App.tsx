/// <reference types="vite-plugin-svgr/client" />

import NavBar from './components/NavBar';

//import { UserInfo, Warning } from './stores';
import useStore from './stores';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';
import ScoreUpload from './components/ScoreUpload';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import Registration from './components/Registration';
import WarningModal from './components/WarningModal';
import ChartsPage from './components/ChartsPage';
import ChartLeaderboard from './components/ChartLeaderboard';
import Settings from './components/Settings';

function App() {

	const warning = useStore((state) => state.warning);
	const setWarning = useStore((state) => state.setWarning);
	const setUser = useStore((state) => state.setUser);

	useEffect(() => {
		let token = localStorage.getItem('accessToken');
		if (token === null) token = "";
		if (token !== "") {
			fetch(import.meta.env.VITE_API_URL + '/api/auth/getuser', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'x-access-token': token
					},
					})
					.then(response => {
						if (!response.ok) {
							console.log("Local storage login failed (expired access token?)")
							localStorage.setItem('accessToken', ""); // Wipe the access token?
							throw new Error("HTTP status " + response.status);
						}
						return response.json();
					})
					.then(data => {
						setUser({
							loggedIn: true,
							user: data.username,
							title: data.title,
							id: data.id,
							pfp: data.pfp,
							isAdmin: data.isAdmin,
							useTranslit: data.useTranslit,
							accessToken: data.accessToken
						})
						localStorage.setItem('accessToken', data.accessToken); // i don't know if this is a good idea but who cares
				});
		}
	}, [])

	return (
		<div className="main">
			<BrowserRouter>
				<NavBar />
            	{warning.enabled && <WarningModal warning = {warning} setWarning = {setWarning} />}
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Registration />} />
					<Route path="/leaderboard" element={<Leaderboard />} />
					<Route path="/charts" element={<ChartsPage />} />
					<Route path="/chart/:id" element={<ChartLeaderboard />} />
					<Route path="/submit" element={<ScoreUpload />} />
					<Route path="/profile/:id" element={<ProfilePage />} />
					<Route path="/settings" element={<Settings />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App;

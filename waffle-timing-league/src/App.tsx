/// <reference types="vite-plugin-svgr/client" />

import NavBar from './components/NavBar';

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

function App() {

	interface userInfo {
		loggedIn: boolean,
		user: string,
		id: number,
		pfp: string,
		isAdmin: boolean,
		accessToken: string
	}
	
    interface Warning {
        enabled: boolean,
        message: string,
        type: number
    }

	// Global states I think
    const [warning, setWarning] = useState<Warning>({enabled: false, message: "", type: 0})
	const [loginInfo, setLoginInfo] = useState<userInfo>({
		loggedIn: false,
		user: "",
		id: -1,
		pfp: "https://i.imgur.com/scPEALU.png",
		isAdmin: false,
		accessToken: ""
	});

	// TODO useEffect that runs on initial page render, get access token from localstorage and send to server to get ID

	useEffect(() => {
		let token = localStorage.getItem('accessToken');
		if (token === null) token = "";
		if (token !== "") {
			fetch('http://localhost:3001/api/auth/getuser', {
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
						setLoginInfo({
							loggedIn: true,
							user: data.username,
							id: data.id,
							pfp: data.pfp,
							isAdmin: data.isAdmin,
							accessToken: data.accessToken
						})
						localStorage.setItem('accessToken', data.accessToken); // i don't know if this is a good idea but who cares
				});
		}
	}, [])

	return (
		<div className="main">
			<BrowserRouter>
				<NavBar loginInfo = {loginInfo} setLoginInfo = {setLoginInfo} setWarning = {setWarning} />
            	{warning.enabled && <WarningModal warning = {warning} setWarning = {setWarning} />}
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<Login loginInfo = {loginInfo} setLoginInfo = {setLoginInfo} setWarning = {setWarning} />} />
					<Route path="/register" element={<Registration loginInfo = {loginInfo} />} />
					<Route path="/leaderboard" element={<Leaderboard />} />
					<Route path="/charts" element={<ChartsPage />} />
					<Route path="/submit" element={<ScoreUpload loginInfo = {loginInfo} />} />
					<Route path="/profile/:id" element={<ProfilePage loginInfo = {loginInfo}/>} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App;

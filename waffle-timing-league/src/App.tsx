import NavBar from './components/NavBar';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';
import ScoreUpload from './components/ScoreUpload';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';

function App() {

	interface userInfo {
		loggedIn: boolean,
		user: string,
		id: number,
		isAdmin: boolean,
		accessToken: string
	}

	// Global states I think
	const [loginInfo, setLoginInfo] = useState<userInfo>({
		loggedIn: false,
		user: "",
		id: -1,
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
				<NavBar loginInfo = {loginInfo} setLoginInfo = {setLoginInfo} />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<Login setLoginInfo = {setLoginInfo} />} />
					<Route path="/leaderboard" element={<Leaderboard />} />
					<Route path="/submit" element={<ScoreUpload loginInfo = {loginInfo} />} />
					<Route path="/profile/:id" element={<ProfilePage loginInfo = {loginInfo}/>} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App;

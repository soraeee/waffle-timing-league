import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(props: any) {

	const navigate = useNavigate();

	interface Credentials {
		user: string,
		pass: string
	}

	const [creds, setCreds] = useState<Credentials>({
		user: "",
		pass: ""
	});

	function handleChange(event: any) {
		const name = event.target.name;
		const value = event.target.value;
		setCreds((values: any) => ({ ...values, [name]: value }))
	}

	function handleLogin(event: any) {
		event.preventDefault();

		fetch('http://localhost:3001/api/auth/signin', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: creds.user,
						password: creds.pass
					}),
					})
					.then(response => {
						if (!response.ok) {
							console.log("Login failed (replace this with a popup modal later)")
							throw new Error("HTTP status " + response.status);
						}
						return response.json();
					})
					.then(data => {
						props.setLoginInfo({
							loggedIn: true,
							user: data.username,
							id: data.id,
							accessToken: data.accessToken
						})
						localStorage.setItem('accessToken', data.accessToken); // i don't know if this is a good idea but who cares
						navigate("/");
				});
	}

	return (
		<>
			<p>cool and epic login portal</p>
			<form onSubmit={handleLogin}>
				<input
					name="user"
					type="text"
					placeholder="Username"
					value={creds.user || ""}
					onChange={handleChange}
				/>
				<input
					name="pass"
					type="password"
					placeholder="Password"
					value={creds.pass || ""}
					onChange={handleChange}
				/>
				<button type="submit">Login</button>
			</form>
		</>
	)
}

export default Login;

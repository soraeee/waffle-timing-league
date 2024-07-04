import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";

function Login(props: any) {

	const navigate = useNavigate();

	interface Credentials {
		username: string,
		password: string
	}
	
	const { register, handleSubmit } = useForm<Credentials>();
	
	const onSubmit: SubmitHandler<Credentials> = (data) => {
		fetch(import.meta.env.VITE_API_URL + '/api/auth/signin', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: data.username,
						password: data.password,
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
							pfp: data.pfp,
							accessToken: data.accessToken
						})
						localStorage.setItem('accessToken', data.accessToken); // i don't know if this is a good idea but who cares
						props.setWarning({enabled: true, message: "You are now logged in as " + data.username + ".", type: 0})
						navigate("/");
				});
	}

	return (
		<div className = "auth-container">
			<p className = "auth-title">welcome back</p>
			{!props.loginInfo.loggedIn 
			? <>
				<form onSubmit = {handleSubmit(onSubmit)} className = "auth-container-form">
					<input 
						placeholder = "Username"
						className = "input-box"
						{...register("username",
							{
								required: true,
								maxLength: 32
							}
						)}
					/>
					<input 
						placeholder = "Password"
						className = "input-box"
						type = "password" 
						{...register("password",
							{
								required: true,
							}
						)}
					/>
					<input type="submit" className = "submit-btn" value = "Login"/>
				</form>
			</>
			: <div>
				<p>You are already logged in!</p>
			</div>}
		</div>
	)
}

export default Login;

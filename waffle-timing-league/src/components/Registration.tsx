import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import useStore from '../stores';

interface formInput {
	username:			string,
	email:				string,
	password:			string,
	passwordConfirm:	string,
}

function Registration() {

	const navigate = useNavigate();
	
	const user = useStore((state) => state.user);

	const { register, handleSubmit, getValues } = useForm<formInput>();
	const onSubmit: SubmitHandler<formInput> = (data) => {
		fetch(import.meta.env.VITE_API_URL + '/api/auth/signup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: data.username,
						email: data.email,
						password: data.password,
					}),
					})
					.then(response => {
						if (!response.ok) {
							console.log("Registration failed (replace this with a popup modal later)")
							throw new Error("HTTP status " + response.status);
						} else {
							navigate("/login");
						}
					});
	}

	return (
		<>
			{!user.loggedIn 
			? <div className = "auth-container">
				<p className = "auth-title">new to WTL?</p>
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
						placeholder = "Email"
						className = "input-box"
						{...register("email",
							{
								required: true,
								// me when email regex
								pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
							}
						)}
					/>
					<input 
						placeholder = "Password"
						type = "password" 
						className = "input-box"
						{...register("password",
							{
								required: true,
							}
						)}
					/>
					<input 
						type = "password" 
						placeholder = "Confirm password"
						className = "input-box"
						{...register("passwordConfirm",
							{
								required: true,
								validate: (value: string) => {
									return value === getValues("password");
								}
							}
						)}
					/>
					<input type="submit" className = "submit-btn" value = "Register"/>
				</form>
			</div>
			: <div>
				<p>You are already logged in!</p>
			</div>}
		</>
	)
}

export default Registration;
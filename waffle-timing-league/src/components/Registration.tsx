import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

interface formInput {
	username:			string,
	email:				string,
	password:			string,
	passwordConfirm:	string,
}

function Registration(props: any) {

	const navigate = useNavigate();

	const { register, handleSubmit, getValues } = useForm<formInput>();
	const onSubmit: SubmitHandler<formInput> = (data) => {
		fetch('http://localhost:3001/api/auth/signup', {
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
			{!props.loginInfo.loggedIn 
			? <>
				<form onSubmit = {handleSubmit(onSubmit)}>
					<input 
						placeholder = "Username"
						{...register("username",
							{
								required: true,
								maxLength: 32
							}
						)}
					/>
					<input 
						placeholder = "Email"
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
						{...register("password",
							{
								required: true,
							}
						)}
					/>
					<input 
						type = "password" 
						placeholder = "Confirm password"
						{...register("passwordConfirm",
							{
								required: true,
								validate: (value: string) => {
									return value === getValues("password");
								}
							}
						)}
					/>
					<input type="submit" />
				</form>
			</>
			: <div>
				<p>You are already logged in!</p>
			</div>}
		</>
	)
}

export default Registration;
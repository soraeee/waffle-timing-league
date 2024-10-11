import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from 'react';

import useStore from '../stores';

function Settings() {

	interface formInput {
		pfp:			string,
		title:			string,
		useTranslit:	boolean,
	}
	
	const user = useStore((state) => state.user);
	const setUser = useStore((state) => state.setUser);

	const setWarning = useStore((state) => state.setWarning);

	const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<formInput>();
	const onSubmit: SubmitHandler<formInput> = (data) => {
		fetch(import.meta.env.VITE_API_URL + '/api/profile/changesettings', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'x-access-token': user.accessToken
					},
					body: JSON.stringify({
						uid:		user.id,
						pfp: 		data.pfp,
						title: 		data.title,
						translit: 	data.useTranslit,
					}),
					})
					.then(response => {
						if (!response.ok) {
							console.log("User update failed (replace this later)")
							throw new Error("HTTP status " + response.status);
						} else {
							setUser({
								loggedIn: 		true,
								user:			user.user,
								title:			data.title,
								id:				user.id,
								pfp:			data.pfp,
								isAdmin:		user.isAdmin,
								useTranslit:	data.useTranslit,
								accessToken:	user.accessToken,
							})
							setWarning({enabled: true, message: "Settings saved!", type: 0})
						}
					});
		console.log(data);
	}

	useEffect(() => {
		setValue("pfp", user.pfp, { shouldValidate: true });
		setValue("title", user.title, { shouldValidate: true });
		setValue("useTranslit", user.useTranslit);
	}, [user])
	return (
		<div className = "settings">
			{user.loggedIn ? 
				<div className = "settings-container">
					<p className = "settings-title">Settings</p>
					<form onSubmit = {handleSubmit(onSubmit)} className = "settings-container-form">
						<div className = "settings-group">
							<p className = "settings-subtitle">Avatar URL</p>
							<input 
								placeholder = "Avatar URL"
								className = "input-box"
								{...register("pfp",
									{
										required: true,
									}
								)}
							/>
						</div>
						<div className = "settings-group">
							<p className = "settings-subtitle">Custom title</p>
							<input 
								placeholder = "Title"
								className = "input-box"
								{...register("title",
									{
										required: true,
										validate: (value: string) => {
											return value.length <= 30 || "test";
										}
									}
									
								)}
							/>
						</div>
						<div className = "settings-group-horizontal">
							<input
								className = "settings-checkbox"
								type = "checkbox"
								{...register("useTranslit")}
							/>
							<p className = "settings-subtitle">Use transliterations</p>
						</div>
						<input type="submit" className = "submit-btn" value = "Save settings"/>
					</form>
				</div>
			: <p>You are not logged in!</p>}
			
		</div>
	)
}

export default Settings;
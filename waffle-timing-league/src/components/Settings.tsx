import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from 'react';

interface userInfo {
	loggedIn: boolean,
	user: string,
	title: string,
	id: number,
	pfp: string,
	isAdmin: boolean,
	useTranslit: boolean,
	accessToken: string
}

interface IProps {
	loginInfo:		userInfo;
	setLoginInfo:	any;
	setWarning:		any;
}

function Settings({ loginInfo, setLoginInfo, setWarning }: IProps) {
	interface formInput {
		pfp:			string,
		title:			string,
		useTranslit:	boolean,
	}

	const { register, handleSubmit, setValue } = useForm<formInput>();
	const onSubmit: SubmitHandler<formInput> = (data) => {
		fetch(import.meta.env.VITE_API_URL + '/api/profile/changesettings', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'x-access-token': loginInfo.accessToken
					},
					body: JSON.stringify({
						uid:		loginInfo.id,
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
							setLoginInfo({
								loggedIn: 		true,
								user:			loginInfo.user,
								title:			data.title,
								id:				loginInfo.id,
								pfp:			data.pfp,
								isAdmin:		loginInfo.isAdmin,
								useTranslit:	data.useTranslit,
								accessToken:	loginInfo.accessToken,
							})
							setWarning({enabled: true, message: "Settings saved!", type: 0})
						}
					});
		console.log(data);
	}

	useEffect(() => {
		setValue("pfp", loginInfo.pfp, { shouldValidate: true });
		setValue("title", loginInfo.title, { shouldValidate: true });
		setValue("useTranslit", loginInfo.useTranslit);
	}, [])
	return (
		<div className = "settings">
			{loginInfo.loggedIn ? 
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
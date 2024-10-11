import { create } from 'zustand';

export interface UserInfo {
	loggedIn: boolean,
	user: string,
	title: string,
	id: number,
	pfp: string,
	isAdmin: boolean,
	useTranslit: boolean,
	accessToken: string
}

export interface Warning {
	enabled: boolean,
	message: string,
	type: number
}

interface storeFuncs {
	setUser: (newUser: UserInfo) => void,
	setWarning: (newWarning: Warning) => void
}

interface storeInterface {
	user: UserInfo,
	warning: Warning,
}

const useStore = create<storeInterface & storeFuncs>()((set) => ({
	user: {
		loggedIn: false,
		user: "",
		title: "",
		id: -1,
		pfp: "https://i.imgur.com/scPEALU.png",
		isAdmin: false,
		useTranslit: true,
		accessToken: "",
	},

	warning: {enabled: false, message: "", type: 0},

	// There's probably a better way to do this lmfao
	setUser: (newUser) => set((state) => ({
		user: newUser
	})),

	setWarning: (newWarning) => set((state) => ({
		warning: newWarning
	}))

}))

export default useStore;
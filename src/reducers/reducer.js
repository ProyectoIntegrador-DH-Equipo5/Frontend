export const reducer = (state, action) => {
	switch (action.type) {
		case "GET_ART":
			return { ...state, data: action.payload };

		case "SET_USER":
			return { ...state, user: action.payload };

		case "CHANGE_THEME":
			console.log(action.payload);
			return { ...state, theme: action.payload };
		default:
			return state;
	}
};

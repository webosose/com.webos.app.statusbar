import { UPDATE_MASTER_VOLUME } from "../actions/actionNames";

const volume = (state = {volume:0}, action) => {
	switch (action.type) {
		case UPDATE_MASTER_VOLUME:
			return {...state,...action.payload};
		default:
			return state;
	}
}
export default volume;
import { FETCH_USER, REMOVE_USER } from "../actions/authAction";

const initState = {
  currentUser: null,
};

const authReducer = (state = initState, action) => {
  switch(action.type) {
    case FETCH_USER: 
      return {
        ...state,
        currentUser: action.payload
      };
    case REMOVE_USER:
      return {
        ...state,
        currentUser: null
      };
    default:
      return state;
  }
};

export default authReducer;

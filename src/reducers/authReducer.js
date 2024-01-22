
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from "../actions/typesActions";



const initialState = {
    isLoggedIn: false,
    userData: null,
};

const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
            };
        case REGISTER_FAIL:
            return {
                ...state,
                isLoggedIn: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userData: action.payload.userData,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userData: null,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userData: null,
            };
        default:
            return state;
    }
};

export default authReducer;
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
} from "./typesActions";

import AuthService from "../services/auth-service";

export const loginSuccess = (userData) => {
    return {
        type: LOGIN_SUCCESS,
        payload: { userData }
    };
};

export const loginFail = (message) => {
    return {
        type: LOGIN_FAIL,
        payload: message
    };
};

export const logOut = () => {
    return{
        type: LOGOUT,
    }
}
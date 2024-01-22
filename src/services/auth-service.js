import apiServices from './api';


const register = async (fullname, email, telephone, address, password) => {
    try {
        const url = '/auth/register';
        const res = await apiServices.post(url, {fullname, email, telephone, address , password});
        return res.status;
    }catch (error){
        return error.response.data;
    }
}

const login = async (email, password) => {
    try {
        const url = '/auth/login';
        const res = await apiServices.post(url, {email, password});
        return res.data;
    }catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const logout = () => {
    sessionStorage.removeItem('user');
}

const authServices = {
    register,
    login,
    logout
}

export default authServices;
import axios from "axios";

const API_URL = 'http://localhost:5555';
// const API_URL = 'https://sem3assigment.azurewebsites.net/';

const apiServices = axios.create({
    baseURL: API_URL,
});

export default apiServices;


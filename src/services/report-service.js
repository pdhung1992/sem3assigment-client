
import api from './api';

const userReport = async (startDate, endDate, axiosConfig) => {
    try {
        const url = `/report/user?startDate=${startDate}&endDate=${endDate}`;
        const res = await api.get(url, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const reportServices = {
    userReport
}

export default reportServices;
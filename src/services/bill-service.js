import api from './api';


const getBillsByUser = async (id, startDate, endDate, axiosConfig) => {
    try {
        const url = `/bill/user/${id}?startDate=${startDate}&endDate=${endDate}`;
        const res = await api.get(url, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const getBillByMonth = async (id, month, year, axiosConfig) => {
    try {
        const url = `/bill/month?id=${id}&month=${month}&year=${year}`;
        const bills = await api.get(url, axiosConfig);
        return bills.data;
    } catch (e) {
        return e.message;
    }
};

const createBill = async (formData, axiosConfig) => {
    try {
        const url = `/bill/create`;
        const res = await api.post(url, formData, axiosConfig);
        return res.data;
    }catch (e){
        return e.message;
    }
}

const getBillDetails = async (id, axiosConfig) => {
    try {
        const url = `/bill/detail/id/${id}`;
        const detail = await api.get(url, axiosConfig);
        return detail.data;
    }catch (e) {
        return e.message;
    }
}

const cancelShipment = async (formData, axiosConfig) => {
    try {
        const url = '/status/cancel';
        const res = await api.post(url, formData, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const billService = {
    getBillsByUser,
    getBillByMonth,
    createBill,
    getBillDetails,
    cancelShipment
}

export default billService;
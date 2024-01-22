import api from './api';


//both

const getProvinces = async () => {
    try {
        const url = '/api/provinces';
        const provinces = await api.get(url);
        return provinces.data;
    }catch (e) {
        return e.message;
    }
}

const getDistByProvince = async (id) => {
    try {
        const url = `/api/districts/p=${id}`;
        const districts = await api.get(url);
        return districts.data;
    }catch (e) {
        return e.message;
    }
}

const getWardByDist = async (id) => {
    try {
        const url = `/api/wards/d=${id}`;
        const wards = await api.get(url);
        return wards.data;
    }catch (e) {
        return e.message;
    }
}

const getWardDetails = async (id) => {
    try {
        const url = `/api/wards/details/${id}`;
        const ward = await api.get(url);
        return ward.data;
    }catch (e) {
        return e.message;
    }
}

//shipping add
const getShipAddByUser = async (userId, axiosConfig) => {
    try {
        const url = `/client/shippingadd/user/${userId}`;
        const addData = await api.get(url, axiosConfig);
        return addData.data;
    }catch (e) {
        return e.message;
    }
}

const getShipAddDetails = async (addId, axiosConfig) => {
    try {
        const url = `/client/shippingadd/detail/${addId}`;
        const details = await api.get(url, axiosConfig);
        return details.data;
    }catch (e) {
        return e.message;
    }
}

const createShipAddress = async (formData, axiosConfig) => {
    try {
        const url = 'client/shippingadd/create';
        const res = await api.post(url, formData, axiosConfig)
        return res.data;
    }
    catch (e) {
        return e.message;
    }
}

const updateShipAddress = async (id, formData, axiosConfig) => {
    try {
        const url = `client/shippingadd/update/${id}`;
        const res = await api.put(url, formData, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const deleteShipAddress = async (id, axiosConfig) => {
    try {
        const url = `client/shippingadd/delete/${id}`;
        const res = await api.delete(url, axiosConfig)
        return res.data;
    }catch (e) {
        return e.message;
    }
}

// delivery add
const getDeliveryAddByUser = async (userId, axiosConfig) => {
    try {
        const url = `/client/deliveryadd/user/${userId}`;
        const addData = await api.get(url, axiosConfig);
        return addData.data;
    }catch (e) {
        return e.message;
    }
}

const getDeliveryAddDetails = async (addId, axiosConfig) => {
    try {
        const url = `/client/deliveryadd/detail/${addId}`;
        const details = await api.get(url, axiosConfig);
        return details.data;
    }catch (e) {
        return e.message;
    }
}

const searchDlvAdd = async (key, axiosConfig) => {
    try {
        const url = `/client/deliveryadd/search?key=${key}`;
        const data = await api.get(url, axiosConfig);
        return data.data;
    }catch (e) {
        return e.message;
    }
}

const createDeliveryAddress = async (formData, axiosConfig) => {
    try {
        const url = 'client/deliveryadd/create';
        const res = await api.post(url, formData, axiosConfig)
        return res.data;
    }
    catch (e) {
        return e.message;
    }
}

const updateDeliveryAddress = async (id, formData, axiosConfig) => {
    try {
        const url = `client/deliveryadd/update/${id}`;
        const res = await api.put(url, formData, axiosConfig);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const deleteDeliveryAddress = async (id, axiosConfig) => {
    try {
        const url = `client/deliveryadd/delete/${id}`;
        const res = await api.delete(url, axiosConfig)
        return res.data;
    }catch (e) {
        return e.message;
    }
}



const addressService = {
    getProvinces,
    getDistByProvince,
    getWardByDist,
    getWardDetails,

    getShipAddByUser,
    createShipAddress,
    getShipAddDetails,
    updateShipAddress,
    deleteShipAddress,

    getDeliveryAddByUser,
    createDeliveryAddress,
    getDeliveryAddDetails,
    searchDlvAdd,
    updateDeliveryAddress,
    deleteDeliveryAddress
}

export default addressService;
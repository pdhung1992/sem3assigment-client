import api from './api';

const getAllPO = async () => {
    try {
        const url = 'api/postoffices';
        const pos = await api.get(url);
        return pos.data;
    }catch (e){
        return e.message;
    }
}

const getAllProvinces = () => {

}

const getAllDistricts = () => {

}

const getAllWards = () => {

}

const getPOByDist = async (id) => {
    try {
        const url = `/api/postoffices/bydist/${id}`;
        const pos = await api.get(url);
        return pos.data;
    }catch (e) {
        return e.message;
    }
}


const postOfficeService = {
    getAllPO,
    getPOByDist,
    getAllProvinces,
    getAllDistricts,
    getAllWards
};



export default postOfficeService;
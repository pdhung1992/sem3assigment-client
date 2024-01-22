import api from './api';

const statusByBill = async (bn) => {
    try {
        const url = `/status/shipment/${bn}`;
        const stt = await api.get(url);
        return stt.data;
    }catch (e){
        return e.message;
    }
}

const statusServices = {
    statusByBill
}

export default statusServices;
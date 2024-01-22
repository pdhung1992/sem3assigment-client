import '../assets/css/dashboard.css'
import { Card, Col, Modal, Row, Select, Space} from "antd";
import {useEffect, useState} from "react";
import postOfficeService from "../services/post-office-service";
import addressService from "../services/address-service";

const FindPostOffice = () => {

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [postOffices, setPostOffices] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');


    useEffect(() => {
        const fetchAllPO = async () => {
            const data = await postOfficeService.getAllPO();
            setPostOffices(data)
        };
        fetchAllPO();
    }, [])

    useEffect(() => {
        const fetchProvince = async () => {
            const data = await addressService.getProvinces();
            setProvinces(data);
        };
        fetchProvince();
    }, [])

    const handleProvinceChange = async (selectedId) => {
        setSelectedProvince(selectedId);
        setSelectedDistrict('')
        const data = await addressService.getDistByProvince(selectedId);
        setDistricts([]);
    }


    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedProvince) {
                setDistricts([]);
                const data = await addressService.getDistByProvince(selectedProvince);
                setDistricts(data);
            }
        };
        fetchDistricts();
    }, [selectedProvince]);


    const handleDistChange = async (selectedId) => {
        setSelectedDistrict(selectedId);
        const data = await postOfficeService.getPOByDist(selectedId);
        setPostOffices(data);
    };

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedLatitude, setSelectedLatitude] = useState(null);
    const [selectedLongitude, setSelectedLongitude] = useState(null);

    const openMapPopup = (latitude, longitude) => {
        setSelectedLatitude(latitude);
        setSelectedLongitude(longitude);
        setModalIsOpen(true);
    };

    const closeMapPopup = () => {
        setSelectedLatitude(null);
        setSelectedLongitude(null);
        setModalIsOpen(false);
    };


    return(
        <div className={'db-content'}>
            <h3>Post Offices Network</h3>
            <hr/>
            <Row>
                <Col span={8}>
                    <Card headStyle={{background: "#dcdcdc"}} title={'Find Post Offices By '} style={{margin: "0 10px 0 0"}}>
                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                            <Row>
                                <Col span={6}>Province</Col>
                                <Col span={18}>
                                    <Select
                                        value={selectedProvince}
                                        style={{width: "100%"}}
                                        options={
                                            [
                                                {
                                                    value: '',
                                                    label: 'Select province'
                                                },
                                                ...provinces.map(province => (
                                                    {
                                                        value: province.id,
                                                        label: province.name
                                                    }
                                                ))
                                            ]
                                        }
                                        onChange={(selectedValue) => handleProvinceChange(selectedValue)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>District</Col>
                                <Col span={18}>
                                    {Array.isArray(districts) ? (
                                        <Select
                                            value={selectedDistrict}
                                            style={{width: "100%"}}
                                            options={
                                                [
                                                    {
                                                        value: '',
                                                        label: 'Select District'
                                                    },

                                                    ...districts.map(dist => ({
                                                        value: dist.id,
                                                        label: dist.name
                                                    }))
                                                ]
                                            }
                                            onChange={(selectedValue) => handleDistChange(selectedValue)}
                                        />
                                    ) : (
                                        <p>No district data</p>
                                    )}
                                </Col>
                            </Row>
                        </Space>
                    </Card>
                </Col>
                <Col span={16}>
                    <Card headStyle={{background: "#dcdcdc"}} title={'Post Office List '} style={{margin: "0 0 0 10px"}}>
                        <div style={{margin: "0 0 0 10px", height: "500px", overflow: "auto"}}>
                            {postOffices.map((postOffice, index) => (
                                <div className={'po-detail'} key={index}>
                                    <h6>{postOffice.postName}</h6>
                                    <p><i className="bi bi-geo-alt-fill"></i> {postOffice.address}</p>
                                    <p><i className="bi bi-telephone-fill"></i> {postOffice.phone}</p>
                                    <p><i className="bi bi-tag-fill"></i> {postOffice.wardName}, {postOffice.districtName}, {postOffice.provinceName}</p>
                                    <button className={"btn main-btn"}
                                        onClick={() => openMapPopup(postOffice.latitude, postOffice.longtitude)}
                                    >
                                        <i className="bi bi-globe-americas"></i> See on map
                                    </button>
                                    <hr/>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Modal title="Post office on map" open={modalIsOpen} onOk={closeMapPopup} onCancel={closeMapPopup}
                           footer={[
                        <button className={"btn main-btn"} key="ok" type="primary" onClick={closeMapPopup}>
                            Close
                        </button>
                    ]}>

                    </Modal>
                </Col>
            </Row>

        </div>
    )
}

export default FindPostOffice;
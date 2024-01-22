import {Button, Col, Input, Modal, Row, Select, Space, Table} from "antd";
import Search from "antd/es/input/Search";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import addressService from "../services/address-service";
import Swal from "sweetalert2";
import {setMessage} from "../actions/messageActions";


const DeliveryAddresses = () => {
    const user = useSelector(state => state.auth)
    const token = user.userData.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const [addresses, setAddresses] = useState([]);
    const fetchAddresses = async () => {
        const addData = await addressService.getDeliveryAddByUser(user.userData.id, axiosConfig);
        setAddresses(addData);
    };

    useEffect(() => {
        fetchAddresses();
    },[])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: "10%",
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: "20%",
        },
        {
            title: 'Telephone',
            dataIndex: 'telephone',
            width: "15%",
        },
        {
            title:'Address',
            dataIndex: 'address',
            width: "30%",
        },
        {
            title: 'Actions',
            render: (_text: any, record: any) => (
                <Space style={{ justifyContent: 'center' }}>
                    <Button type="primary" onClick={() => showDetailModal(record.id)}>Details</Button>
                    <Button   onClick={() => showEditModal(record.id)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            ),
            width: "25%",
        }
    ];

    const [addDetails, setAddDetails] = useState({});
    const [wardDetails, setWardDetails] = useState({});

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Address will be removed from your address list!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5ba515',
                cancelButtonColor: '#ee0033',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                await addressService.deleteDeliveryAddress(id, axiosConfig);
                setAddresses(addresses.filter((deletedAdd) => deletedAdd.id !== id));
                await Swal.fire({
                    title: 'Delete Successfully!',
                    text: 'Address removed from your address list!',
                    icon: 'success',
                    confirmButtonColor: '#5ba515',
                });
            }
        } catch (error) {
            console.error(`Error deleting address with ID ${id}:`, error);
            Swal.fire({
                title: 'Delete error!',
                text: 'An error occurred while deleting address!',
                icon: 'error',
                confirmButtonColor: '#ee0033',
            });
        }
    };


    const data = addresses;
    const onSearchBill = () => {

    }

    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const [name, setName] = useState('');
    const [telephone, setTelephone] = useState('');
    const [address, setAddress] = useState('');

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    useEffect(() => {
        const fetchProvince = async () => {
            const data = await addressService.getProvinces();
            setProvinces(data);
        };
        fetchProvince();
    }, [])

    const handleProvinceChange = async (selectedId) => {
        setSelectedProvince(selectedId);

        const data = await addressService.getDistByProvince(selectedId);
        setDistricts(data);

        setSelectedDistrict('')
        setWards([]);
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
    },[selectedProvince])

    const handleDistChange = async (selectedId) => {

        setSelectedDistrict(selectedId);
        const data = await addressService.getWardByDist(selectedId);
        setWards(data);
        setSelectedWard('');
    }

    useEffect(() => {
        const fetchWards = async () => {
            if (selectedDistrict){
                const data = await addressService.getWardByDist(selectedDistrict);
                setWards(data);
            }
        };
        fetchWards();
    },[selectedDistrict])


    const handleWardChange = (selectedId) => {
        setSelectedWard(selectedId);
    }


    const showCreateModal = () => {
        setOpenCreate(true);
    };
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const userId = user.userData.id;
        const wardId = selectedWard;
        const formData = {
            name, telephone, userId, address, wardId
        }


        const fetchNewAdd = async () => {
            try {
                const res = await addressService.createDeliveryAddress(formData, axiosConfig);
                console.log(res)
                if(res.name){
                    setMessage("Address created successfully!");
                    Swal.fire({
                        title: 'Address created Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    fetchAddresses();
                    setOpenCreate(false)
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchNewAdd();
    };
    const handleCreateCancel = () => {
        setOpenCreate(false);
    };

    const showDetailModal = async (id) => {
        const detail = await addressService.getDeliveryAddDetails(id, axiosConfig);
        setAddDetails(detail);
        setOpenDetail(true);
    };
    const handleDetailCancel = () => {
        setOpenDetail(false);
    };

    const showEditModal = async (id) => {
        const detail = await addressService.getDeliveryAddDetails(id, axiosConfig);
        setAddDetails(detail);
        const wardDetail = await addressService.getWardDetails(detail.wardId);
        setWardDetails(wardDetail);
        setSelectedProvince(wardDetail.provinceId);
        setSelectedDistrict(wardDetail.districtId);
        setOpenEdit(true);
    };

    const onChange = (e) => {
        const {name, value} = e.target;
        setAddDetails(prevAdd => ({
            ...prevAdd, [name] : value
        }));
    }
    const handleEditSubmit = (e) => {
        e.preventDefault();

        const wardIdToUse = selectedWard !== '' ? selectedWard : addDetails.wardId;

        const userId = user.userData.id;
        const id = addDetails.id;
        const name = addDetails.name;
        const telephone = addDetails.telephone;
        const address = addDetails.address;
        const wardId = wardIdToUse;
        const formData = {
            name, telephone, userId, address, wardId
        }
        const fetchUpdateAdd = async () => {
            try {
                const res = await addressService.updateDeliveryAddress(id, formData, axiosConfig);
                if(res){
                    setMessage("Address updated successfully!");
                    Swal.fire({
                        title: 'Address updated Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    fetchAddresses();
                    setOpenEdit(false)
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUpdateAdd();
    };
    const handleEditCancel = () => {
        setOpenEdit(false);
    };




    return(

        <div className={'db-content'}>
            <h3>Delivery Addresses Management:</h3>
            <hr/>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Search
                        placeholder="Enter name or telephone number..."
                        allowClear
                        enterButton="Search"
                        onSearch={onSearchBill}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'center' }}>

                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'end' }}>
                    <button className={'main-btn btn'}   onClick={showCreateModal}>
                        <PlusOutlined /> Create New Delivery Address
                    </button>
                </Col>
            </Row>
            <hr/>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record, index) => index}
                pagination={{
                    pageSize: 10,
                }}
                scroll={{
                    y: 500,
                }}
            />


            <Modal
                open={openCreate}
                title="Create new Delivery Address"
                onCancel={handleCreateCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleCreateCancel}>
                            Cancel
                        </button>,
                        <button className={'btn main-btn'} type={"submit"} onClick={handleCreateSubmit}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={4}>Name</Col>
                            <Col span={20}>
                                <Input placeholder='Enter Delivery name...'
                                       value={name}
                                       onChange={(e) => setName(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>Telephone</Col>
                            <Col span={20}>
                                <Input placeholder='Enter Telephone number...'
                                       value={telephone}
                                       onChange={(e) => setTelephone(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>Address</Col>
                            <Col span={20}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Input placeholder='Enter address...'
                                           value={address}
                                           onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <Select
                                        defaultValue={''}
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
                                    {Array.isArray(districts) ? (
                                        <Select
                                            defaultValue={''}
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
                                    {Array.isArray(wards) ? (
                                        <Select
                                            defaultValue={''}
                                            style={{width: "100%"}}
                                            options={
                                                [
                                                    {
                                                        value: '',
                                                        label: 'Select Ward'
                                                    },
                                                    ...wards.map(ward => ({
                                                        value: ward.id,
                                                        label: ward.name
                                                    }))
                                                ]
                                            }
                                            onChange={(selectedValue) => handleWardChange(selectedValue)}
                                        />
                                    ) : (
                                        <p>No ward data</p>
                                    )}
                                </Space>
                            </Col>
                        </Row>
                    </Space>
                </form>
            </Modal>
            <Modal
                open={openDetail}
                title="Delivery Address Details"
                onCancel={handleDetailCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleDetailCancel}>
                            Cancel
                        </button>,
                        <button className={"btn btn-warning"} onClick={() => {
                            showEditModal(addDetails.id);
                            handleDetailCancel();
                        }}>Edit</button>
                    </Space>
                ]}
            >
                <hr/>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Row>
                        <Col span={6}>Name</Col>
                        <Col span={18}>{addDetails.name}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Telephone</Col>
                        <Col span={18}>{addDetails.telephone}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Address</Col>
                        <Col span={18}>
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                {addDetails.address}
                                {addDetails.wardName}
                                {addDetails.districtName}
                                {addDetails.provinceName}
                            </Space>
                        </Col>
                    </Row>
                </Space>
            </Modal>
            <Modal
                open={openEdit}
                title="Edit Delivery Address"
                onCancel={handleEditCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleEditCancel}>
                            Cancel
                        </button>,
                        <button key="submit" className={'btn main-btn'} onClick={handleEditSubmit}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Row>
                        <Col span={4}>Name</Col>
                        <Col span={20}>
                            <Input placeholder='Enter Delivery name...'
                                   value={addDetails.name}
                                   name="name"
                                   onChange={onChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}>Telephone</Col>
                        <Col span={20}>
                            <Input placeholder='Enter Telephone number...'
                                   value={addDetails.telephone}
                                   name="telephone"
                                   onChange={onChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}>Address</Col>
                        <Col span={20}>
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Input placeholder='Enter address...'
                                       value={addDetails.address}
                                       name="address"
                                       onChange={onChange}
                                />
                                <Select
                                    defaultValue={wardDetails.provinceId}
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
                                {Array.isArray(districts) ? (
                                    <Select
                                        defaultValue={wardDetails.districtId}
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
                                {Array.isArray(wards) ? (
                                    <Select
                                        defaultValue={addDetails.wardId}
                                        name="wardId"
                                        style={{width: "100%"}}
                                        options={
                                            [
                                                {
                                                    value: '',
                                                    label: 'Select Ward'
                                                },
                                                ...wards.map(ward => ({
                                                    value: ward.id,
                                                    label: ward.name
                                                }))
                                            ]
                                        }
                                        onChange={(selectedValue) => handleWardChange(selectedValue)}
                                    />
                                ) : (
                                    <p>No ward data</p>
                                )}
                            </Space>
                        </Col>
                    </Row>
                </Space>
                </form>
            </Modal>
        </div>
    )
}

export default DeliveryAddresses;
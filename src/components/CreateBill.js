
import '../assets/css/dashboard.css'
import {Card, Checkbox, Col, Input, Modal, Radio, Row, Select, Space} from "antd";
import Meta from "antd/es/card/Meta";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import addressService from "../services/address-service";
import {setMessage} from "../actions/messageActions";
import Swal from "sweetalert2";
import billService from "../services/bill-service";


const CreateBill = () => {
    const user =  useSelector(state => state.auth)
    const userId = user.userData.id;
    const token = user.userData.token;
    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const navigate = useNavigate();


    //handle shipping address
    const [shipAdds, setShipAdds] = useState([]);
    useEffect(() => {
        const fetchShipAdds = async () =>{
            const data = await addressService.getShipAddByUser(userId, axiosConfig);
            setShipAdds(data);
        }
        fetchShipAdds();
    },  [])

    const [dlvAdds, setDlvAdds] = useState([]);

    useEffect(() => {
        const fetchDlvAdds = async () => {
            const data = await addressService.getDeliveryAddByUser(userId, axiosConfig);
            setDlvAdds(data);
        };
        fetchDlvAdds()
    }, [])

    //handle dlv address

    const [searchKey, setSearchKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(true);
    const [selectedCnee, setSelectedCnee] = useState({});



    useEffect(() => {
        if(searchKey !== null && searchKey !== undefined){
            if (searchKey.trim() === '') {
                setSearchResults([]);
                setSelectedCnee({});
                setDeliveryAddId('');
                setShowResults(false);
            } else {
                setShowResults(true);
                setIsLoading(true);
            }
        }
    }, [searchKey]);

    useEffect(() => {
        if(searchKey !== null && searchKey !== undefined){
            if (searchKey.trim() !== '') {
                const fetchSearch = async () => {
                    setIsLoading(true);
                    try {
                        const res = await addressService.searchDlvAdd(searchKey, axiosConfig);
                        setSearchResults(res);
                    } catch (error) {
                        console.error('Error fetching search results:', error);
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchSearch();
            }
        }
    }, [searchKey]);

    const handleResultClick = async (result) => {
        try {
            await setSearchKey(result.telephone);
            setSelectedCnee(result);
            setDeliveryAddId(result.id);
            setSearchKey(result.telephone);
            setShowResults(false);
        }catch (e) {
            return e.message;
        }
    };

    //create new add

    const [name, setName] = useState('');
    const [telephone, setTelephone] = useState('');
    const [address, setAddress] = useState('');

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    const [openCreate, setOpenCreate] = useState(false);

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

        console.log(formData)
        const fetchNewAdd = async () => {
            try {
                const res = await addressService.createDeliveryAddress(formData, axiosConfig);
                if(res.name){
                    setMessage("Address created successfully!");
                    Swal.fire({
                        title: 'Address created Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    setSelectedCnee(res);
                    setDeliveryAddId(res.id);
                    setSearchKey(res.telephone);
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

    //edit address
    const [openEdit, setOpenEdit] = useState(false);
    const [addDetails, setAddDetails] = useState({});
    const [wardDetails, setWardDetails] = useState({});
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
        console.log(formData);
        const fetchUpdateAdd = async () => {
            try {
                const res = await addressService.updateDeliveryAddress(id, formData, axiosConfig);
                console.log(res)
                if(res){
                    setMessage("Address updated successfully!");
                    Swal.fire({
                        title: 'Address updated Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    setSelectedCnee(res);
                    setDeliveryAddId(res.id);
                    setSearchKey(res.telephone);
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

    //handle bill form

    const [shippingAddId, setShippingAddId] = useState('');
    const [deliveryAddId, setDeliveryAddId] = useState('');
    const [pickupType, setPickupType] = useState('home');
    const [deliveryType, setDeliveryType] = useState('home');
    const [payer, setPayer] = useState('shipper');
    const [note, setNote] = useState('');
    const [cod, setCod] = useState(0);

    const [goodName, setGoodName] = useState('');
    const [nature, setNature] = useState('general');
    const [weight, setWeight] = useState(0);
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [value, setValue] = useState(0);

    const onChangeGoodName = (e) => {
        setGoodName(e.target.value)
    }

    const onChangeLength = (e) => {
        const { value } = e.target;
        setLength(parseInt(value))
    }
    const onChangeWidth = (e) => {
        const { value } = e.target;
        setWidth(parseInt(value))
    }
    const onChangeHeight = (e) => {
        const { value } = e.target;
        setHeight(parseInt(value))
    }
    const onChangeWeight = (e) => {
        const { value } = e.target;
        setWeight(parseInt(value))
    }
    const onChangeValue = (e) => {
        const { value } = e.target;
        setValue(parseInt(value))
    }
    const onChangeNature = (e) => {
        setNature(e.target.value);
    }
    const onChangePayer = (e) => {
        setPayer(e.target.value)
    }
    const onChangeCod = (e) => {
        const { value } = e.target;
        setCod(parseInt(value))
    }
    const onChangePickupType = (e) => {
        setPickupType(e.target.value)
    }
    const onChangeDeliveryType = (e) => {
        setDeliveryType(e.target.value)
    }
    const onChangeNote = (e) => {
        setNote(e.target.value)
    }

    const [agreeTerm, setAgreeTerm] = useState(false);

    const handleAgeeTerm = (e) => {
        setAgreeTerm(e.target.checked);
    }


    const handleCreateBill = (e) => {
        e.preventDefault();

        if(agreeTerm){
            const name = goodName;
            setDeliveryAddId(selectedCnee.id);

            const formData = {
                userId, shippingAddId, deliveryAddId, pickupType, deliveryType, payer, note, cod, name, nature, weight, length, width, height, value
            }
            console.log(formData)
            const fetchNewBill = async () => {
                try {
                    const res = await billService.createBill(formData, axiosConfig);
                    if(res && res.billNumber){
                        setMessage("Bill created successfully!");
                        Swal.fire({
                            title: 'Bill created Successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#5ba515'
                        });
                        navigate('/client/bills')
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchNewBill();
        } else {
           Swal.fire({
               title: 'Oops!',
               icon: 'error',
               text: 'Please read and agree with the terms and conditions',
               confirmButtonText: 'OK',
               confirmButtonColor: '#f27474'
           }) ;
        }

    }




    return(
        <div className='db-content'>
            <h3>Create bill:</h3>
            <hr/>
            <form onSubmit={handleCreateBill}>
            <Row>
                <Col span={12} style={{padding: "0 1% 0 0"}}>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Card headStyle={{background: "#dcdcdc"}} type={'inner'} title={'Shipper: '}>
                            <Select
                                defaultValue={''}
                                style={{width: "100%"}}
                                options={
                                    [
                                        {
                                            value: '',
                                            label: 'Select shipper information'
                                        },
                                        ...shipAdds.map(add => ({
                                            value: add.id,
                                            label: `${add.name}, ${add.address}, ${add.wardName}, ${add.districtName}, ${add.provinceName}`
                                        }
                                        ))
                                    ]
                                }
                                onChange={(selectedValue) => setShippingAddId(selectedValue)}
                            />
                        </Card>
                        <Card headStyle={{background: "#dcdcdc"}} type={'inner'} title={'Consignee'}>
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Row>
                                    <Col span={4}>Telephone</Col>
                                    <Col className={"custom-input"} span={20}>
                                        <Input
                                            placeholder='Enter Telephone number to find...'
                                            value={selectedCnee ? selectedCnee.telephone : searchKey}
                                            onChange={(e) => setSearchKey(e.target.value)}
                                            allowClear
                                        />
                                        {isLoading? (
                                            <p>Loading...</p>
                                        ) : (
                                            <ul className="search-rs-area" style={{ maxHeight: '9rem', overflowY: 'auto' }}>
                                                {(showResults && Array.isArray(searchResults)) ? (
                                                    (searchKey && searchResults.length === 0) ? (
                                                        <div>
                                                            <li>No result found! <a style={{color: "#ee0033", textDecoration: "underline"}} onClick={showCreateModal}>Create new Address here</a></li>
                                                        </div>
                                                    ) : (
                                                        searchResults.map((result, index) => (
                                                            <li key={index} onClick={() => handleResultClick(result)}>
                                                                {result.telephone}, {result.name}, {result.address}, {result.wardName}, {result.districtName}, {result.provinceName}
                                                            </li>
                                                        ))
                                                    )
                                                ) : null}
                                            </ul>
                                            )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4}>Name</Col>
                                    <Col className={"custom-input"} span={20}>
                                        <Input placeholder='Consignee name...'
                                               value={selectedCnee.name}
                                               disabled
                                               style={{color: "#000000"}}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4}>Address</Col>
                                    <Col className={"custom-input"} span={20}>
                                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                            <Input placeholder='Address...'
                                                   value={selectedCnee.address}
                                                   disabled
                                                   style={{color: "#000000"}}
                                            />
                                            <Input placeholder='Ward...'
                                                   value={selectedCnee.wardName}
                                                   disabled
                                                   style={{color: "#000000"}}
                                            />
                                            <Input placeholder='District...'
                                                   value={selectedCnee.districtName}
                                                   disabled
                                                   style={{color: "#000000"}}
                                            />
                                            <Input placeholder='Province...'
                                                   value={selectedCnee.provinceName}
                                                   disabled
                                                   style={{color: "#000000"}}
                                            />
                                            {Object.keys(selectedCnee).length !== 0 ? (
                                                <div className={'text-center'}>
                                                    <button type={"button"} className={'btn btn-warning'} onClick={() => {showEditModal(selectedCnee.id)}}>Edit Address</button>
                                                </div>
                                            ) : (
                                                <div></div>
                                            )}
                                        </Space>
                                    </Col>
                                </Row>
                            </Space>
                        </Card>
                    </Space>
                </Col>
                <Col span={12} style={{padding: "0 0 0 1%"}}>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Card headStyle={{background: "#dcdcdc"}} type={'inner'} title={'Good Information'}>
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Row>
                                    <Col span={6}>Name</Col>
                                    <Col className={"custom-input"} span={18}>
                                        <Input
                                            placeholder='Enter Goods name...'
                                            name="goodName"
                                            onChange={onChangeGoodName}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>Dimension</Col>
                                    <Col span={18}>
                                        <Row>
                                            <Space>
                                                <Col className={"custom-input"} span={24}>
                                                    <Input placeholder='Length(cm)...'
                                                           name="length"
                                                           onChange={onChangeLength}
                                                    />
                                                </Col>
                                                <Col className={"custom-input"} span={24}>
                                                    <Input placeholder='Width(cm)...'
                                                           name="width"
                                                           onChange={onChangeWidth}
                                                    />
                                                </Col>
                                                <Col className={"custom-input"} span={24}>
                                                    <Input placeholder='Height(cm)...'
                                                           name="height"
                                                           onChange={onChangeHeight}
                                                    />
                                                </Col>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>Weight</Col>
                                    <Col className={"custom-input"} span={18}>
                                        <Input placeholder='Enter Weight(g)...'
                                               name="weight"
                                               type="number"
                                               onChange={onChangeWeight}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>Value</Col>
                                    <Col className={"custom-input"} span={18}>
                                        <Input placeholder='Enter Value...'
                                               name="value"
                                               onChange={onChangeValue}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>Nature of good</Col>
                                    <Col span={18}>
                                        <Row>
                                            <Radio.Group
                                                value={nature}
                                                onChange={onChangeNature}
                                            >
                                                <Radio className="custom-radio" value="general" checked>General</Radio>
                                                <Radio className="custom-radio" value="valuable">Valuable</Radio>
                                                <Radio className="custom-radio" value="fragile">Fragile</Radio>
                                                <Radio className="custom-radio" value="liquid">Liquid</Radio>
                                                <Radio className="custom-radio" value="perishable">Perishable</Radio>
                                            </Radio.Group>
                                        </Row>
                                    </Col>
                                </Row>
                            </Space>
                        </Card>
                        <Card headStyle={{background: "#dcdcdc"}} type={'inner'} title={'Bill Details'}>
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Row>
                                    <Col span={6}>Charge pay by</Col>
                                    <Col span={18}>
                                        <Radio.Group
                                            value={payer}
                                            onChange={onChangePayer}
                                        >
                                            <Radio className="custom-radio" value={'shipper'}>Shipper</Radio>
                                            <Radio className="custom-radio" value={'consignee'}>Consignee</Radio>
                                        </Radio.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>Cash on Delivery (CoD)</Col>
                                    <Col className={"custom-input"} span={18}>
                                        <Input placeholder='Enter CoD amount...'
                                               name="cod"
                                               onChange={onChangeCod}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>Pick up request</Col>
                                    <Col span={18}>
                                        <Radio.Group
                                            value={pickupType}
                                            onChange={onChangePickupType}
                                        >
                                            <Radio className="custom-radio" value={'home'}>Pick up at Home</Radio>
                                            <Radio className="custom-radio" value={'post-office'}>Receive at Post Office</Radio>
                                        </Radio.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>Deliver request</Col>
                                    <Col span={18}>
                                        <Radio.Group
                                            value={deliveryType}
                                            onChange={onChangeDeliveryType}
                                        >
                                            <Radio className="custom-radio" value={'home'}>Delivery at Home</Radio>
                                            <Radio className="custom-radio" value={'post-office'}>Delivery at Post Office</Radio>
                                        </Radio.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>Note</Col>
                                    <Col className={"custom-input"} span={18}
                                         name="note"
                                         onChange={onChangeNote}
                                    >
                                        <Input/>
                                    </Col>
                                </Row>
                            </Space>
                        </Card>
                    </Space>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Card
                        hoverable
                        style={{
                            margin: "5%",
                            textAlign: "center",
                            border: "solid 1px #ee0033"
                        }}

                    >
                        <Meta title={<Checkbox onChange={handleAgeeTerm}>I have read and agree with terms and conditions</Checkbox>} description={ <div>
                            <button type={"submit"} className={"btn btn-outline-danger"}>Submit</button>
                            <span>       </span>
                            <Link to={'/client/bills'}><button className={"btn btn-outline-secondary"}>Cancel</button></Link>
                        </div>} />
                    </Card>
                </Col>
            </Row>
            </form>
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
                <form >
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

export default CreateBill;

import '../assets/css/home.css';
import 'bootstrap';
import React, {useEffect, useState} from "react";
import {Collapse} from "react-bootstrap";
import postOfficeService from "../services/post-office-service";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import authServices from "../services/auth-service";
import {logOut} from '../actions/authActions'
import { Card, Col, Modal, Row, Select, Space, Timeline} from "antd";
import {SendOutlined} from '@ant-design/icons'
import addressService from "../services/address-service";
import Search from "antd/es/input/Search";
import statusServices from "../services/status-service";
import moment from "moment/moment";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';



const Home = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.auth);

    const [message, setMessage] = useState("");

    const [collapseOpen, setCollapseOpen] = useState(false);

    const [selectedTab, setSelectedTab] = useState('tab-1');


    const handleTabClick = (tabId) => {
        if (selectedTab === tabId) {
            setSelectedTab(null);
        } else {
            setSelectedTab(tabId);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const mainNav = document.getElementById('mainNav');
            if (window.scrollY > 50) {
                mainNav.classList.add('navbar-shrink');
            } else {
                mainNav.classList.remove('navbar-shrink');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSectionClick = (sectionId) => {
        setCollapseOpen(false);

        const navbarHeight = document.getElementById('mainNav').offsetHeight;
        const targetSection = document.getElementById(sectionId);
        const targetSectionTop = targetSection.offsetTop - navbarHeight;

        window.scrollTo({
            top: targetSectionTop,
            behavior: 'smooth'
        });
    };

    const [status, setStatus] =useState([]);
    const[flag, setFlag] = useState(0);

    const onSearch = async (value) => {
        const status = await statusServices.statusByBill(value);
        setStatus(status);
        setFlag(flag+1);
    }

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


    const handleSignOut = async () => {
        try {
            await authServices.logout();
            dispatch(logOut());
            navigate('/login')
        }catch (error){
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            setMessage(resMessage);
        }
    }
    const [updateTab3, setUpdateTab3] = useState(false);


    const handleTab3Update = () => {
        setUpdateTab3(prevState => !prevState);
    };

    return(
        <>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top py-3 main-nav" id={"mainNav"}>
                <div className="container px-4 px-lg-5">
                    <a className="navbar-brand" href="#page-top">TransportX</a>
                    <button className="navbar-toggler navbar-toggler-right" type={"button"} onClick={() => setCollapseOpen(!collapseOpen)}><span className="navbar-toggler-icon"></span></button>
                    <Collapse in={collapseOpen}>
                        <div className={`collapse navbar-collapse ${collapseOpen ? 'show' : ''}`} id="navbarResponsive">
                            <ul className="navbar-nav ms-auto my-2 my-lg-0">
                                <li className="nav-item"><a className="nav-link" href="#lookup" onClick={() => handleSectionClick('lookup')}>Look Up</a></li>
                                <li className="nav-item"><a className="nav-link" href="#services" onClick={() => handleSectionClick('services')}>Services</a></li>
                                <li className="nav-item"><a className="nav-link" href="#news" onClick={() => {handleSectionClick('news')}}>News</a></li>
                                <li className="nav-item"><a className="nav-link" href="#about" onClick={() => handleSectionClick('about')}>About</a></li>
                                {/*<li className="nav-item"><a className="nav-link" href="#contact" onClick={() => handleSectionClick('contact')}>Contact</a></li>*/}
                                {user.isLoggedIn ? (
                                    <>
                                        <li className="nav-item"><Link className="nav-link" to="/client">Hello, {user.userData.fullname}</Link></li>
                                        <li className="nav-item"><Link className="nav-link" to=""><span onClick={handleSignOut}>Sign out</span></Link></li>
                                    </>

                                ) : (
                                    <li className="nav-item"><Link className="nav-link" to="/login">Login/Register</Link></li>
                                )}
                            </ul>
                        </div>
                    </Collapse>
                </div>
            </nav>

            <header className="masthead">
                <div className="container px-4 px-lg-5 h-100">
                    <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
                        <div className=" align-self-end">
                            <h1 className="lp-slogan">Delivering Speed, Connecting Dreams</h1>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                        {/*<div className="col-lg-8 align-self-baseline">*/}
                        {/*    <a className="btn main-btn btn-xl" href="#about">Find Out More</a>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </header>

            <section className="page-section" id="lookup">
                <div className="container px-4 px-lg-5">
                    <div className="row gx-4 gx-lg-5 justify-content-center">
                        <div className=" text-center">
                            <div className="search-tabs">
                                <div className="sub-search-tab">
                                    <input
                                        type="radio"
                                        id="tab-1"
                                        name="tabby-tabs"
                                        checked={selectedTab === 'tab-1'}
                                        onChange={() => handleTabClick('tab-1')}
                                    />
                                    <label htmlFor="tab-1"><SendOutlined style={{color: "#ee0033"}} /> Track your shipment</label>
                                    <div className={'search-content'}>
                                        {selectedTab === 'tab-1' && (
                                            <div className="row">
                                                <div className="col text-start" style={{marginRight: "100px"}}>
                                                        <h4>Bill number: </h4>
                                                        <Search
                                                            placeholder="Enter bill number to track..."
                                                            allowClear
                                                            enterButton={
                                                                <button className={'main-btn btn btn-xl'}
                                                                        type={'submit'}>Track your shipment <i
                                                                    className="bi bi-arrow-right"></i></button>
                                                            }
                                                            size="large"
                                                            onSearch={onSearch}
                                                        />
                                                </div>
                                                <div className="col text-start" style={{overflowY: "auto", maxHeight: "400px", paddingTop: "40px"}}>
                                                    {flag === 0 ? (
                                                        <div>

                                                            <img src="/img/tracking.jpg" alt="tracking"
                                                                 className={'img-fluid'}/>
                                                        </div>
                                                    ) : (
                                                        <Timeline>
                                                            {Array.isArray(status) && status.length !== 0 ? (
                                                                status.map((status, index) => (
                                                                    <Timeline.Item key={index} color={"#ee0033"}>
                                                                        <h6>{status.name}</h6>
                                                                        <p>At {moment(status.time).format('DD/MM/YYYY HH:mm:ss')}</p>
                                                                    </Timeline.Item>
                                                                ))
                                                            ) : (
                                                                    <Timeline.Item color={"#ee0033"}>
                                                                        <h6>Bill not found.</h6>
                                                                    </Timeline.Item>
                                                            )}
                                                        </Timeline>
                                                        )}

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/*<div className="sub-search-tab">*/}
                                {/*    <input*/}
                                {/*        type="radio"*/}
                                {/*        id="tab-2"*/}
                                {/*        name="tabby-tabs"*/}
                                {/*        checked={selectedTab === 'tab-2'}*/}
                                {/*        onChange={() => handleTabClick('tab-2')}*/}
                                {/*    />*/}
                                {/*    <label htmlFor="tab-2"><i className="bi bi-coin"></i> Cost estimation</label>*/}
                                {/*    <div className={'search-content'}>*/}
                                {/*        {selectedTab === 'tab-2' && (*/}
                                {/*            <div className={'row'}>*/}
                                {/*                <div className="col"></div>*/}
                                {/*                <div className="col">*/}
                                {/*                    <img src="/img/cost.png" alt="" className={'img-fluid'}/>*/}
                                {/*                </div>*/}
                                {/*            </div>*/}
                                {/*        )}*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                <div className="sub-search-tab">
                                    <input
                                        type="radio"
                                        id="tab-3"
                                        name="tabby-tabs"
                                        checked={selectedTab === 'tab-3'}
                                        onChange={() => {
                                            handleTabClick('tab-3');
                                            // handleTab3Update()
                                            }
                                        }
                                    />
                                    <label htmlFor="tab-3"><i className="bi bi-geo-alt"></i> Find Post office</label>
                                    <div className="search-content">
                                        {selectedTab === 'tab-3' && (
                                            <div className={'text-start po'}>
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
                                        )}
                                    </div>
                                </div>

                                <div className="sub-search-tab">
                                    <input
                                        type="radio"
                                        id="tab-4"
                                        name="tabby-tabs"
                                        checked={selectedTab === 'tab-4'}
                                        onChange={() => handleTabClick('tab-4')}
                                    />
                                    <label htmlFor="tab-4"><i className="bi bi-mailbox-flag"></i> Agent registration</label>
                                    <div className={'search-content'}>
                                        {selectedTab === 'tab-4' && (
                                            <div className={'row'}>
                                                <div className="col text-start">
                                                    <h4>Agent registration</h4>
                                                    <br/>
                                                    <p>TransportX is a leading enterprise providing domestic and international parcel and parcel delivery services in Vietnam. With an extensive network of 63 provinces in the country. TransportX committed to providing all the best transportation solutions for customers with the motto "FAST, SAFE, EFFICIENCY".</p>
                                                    <p>With the target to expand the nationwide coverage network, TransportX recruits units and individuals with suitable premises to act as agents to receive and deliver goods nationwide.</p>
                                                    <br/>
                                                    <button className={'main-btn btn btn-xl'} type={'button'}>Registration <i className="bi bi-arrow-right"></i></button>
                                                </div>
                                                <div className="col">
                                                    <img src="/img/agent-regis.png" alt="" className={'img-fluid'}/>
                                                </div>
                                            </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section service-section" id="services">
                <div className="container px-4 px-lg-5">
                    <br/>
                    <h2 className="text-center mt-0">Our Services</h2>
                    <div className="row gx-4 gx-lg-5">
                        <div className="col-lg-3 col-md-6 text-center">
                            <div className="mt-5">
                                <div className="mb-2"><i className="bi-airplane fs-1"></i></div>
                                <h3 className="h4 mb-2">Domestic Delivery</h3>
                                <p className="text-muted mb-0">A solution to transport package from one place to another with optimal delivery time, provides many incentives related to collection fees, refunds, receiving packages...</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center">
                            <div className="mt-5">
                                <div className="mb-2"><i className="bi-file-post-fill fs-1 "></i></div>
                                <h3 className="h4 mb-2">Express Document Delivery</h3>
                                <p className="text-muted mb-0">As a service of receiving, transporting and transmitting letters, documents within the country according to standard time.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center">
                            <div className="mt-5">
                                <div className="mb-2"><i className="bi-clock-fill fs-1 "></i></div>
                                <h3 className="h4 mb-2">Express/Scheduled Delivery</h3>
                                <p className="text-muted mb-0">As a service of receiving, transporting and couriering packages and items with the highest priority within 24 hours</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center">
                            <div className="mt-5">
                                <div className="mb-2"><i className="bi-send-plus-fill fs-1 "></i></div>
                                <h3 className="h4 mb-2">Additional Service</h3>
                                <p className="text-muted mb-0">This is service to support the delivery of TransportX to serve the customers, meeting the needs of customers.</p>
                            </div>
                        </div>
                    </div>
                    <br/>
                </div>
            </section>
            <section className="page-section news-section" id="news">
                <div className="container px-4 px-lg-5">
                    <br/>
                    <h2 className="text-center mt-0">News</h2>
                    <br/>
                    <Row>
                        <Col span={12} style={{paddingRight: "1%"}}>
                            <Card hoverable>
                                <h5><Link to={''}>TOP 5 MOST PRESTIGIOUS AND QUALITY DELIVERY SERVICES IN VIETNAM <i
                                    className="bi bi-arrow-right"></i></Link></h5>
                                <Link to=''><img src="/img/new1.png" alt=""/></Link>
                            </Card>
                        </Col>
                        <Col span={12} style={{paddingLeft: "1%"}}>
                            <Space direction={"vertical"} size={"middle"}>
                                <Card hoverable>
                                    <Link to={''}><h5>Information disclosure the Resolution of the Board of Directors regarding the cancellation of the last registration date..</h5></Link>
                                    <Link to=''><p>TransportX Co. Ltd. hereby announce the Resolution of the Board of Directors regarding the cancellation...</p></Link>
                                    <Link to=''><p>Read more <i className="bi bi-arrow-right"></i></p></Link>
                                </Card>
                                <Card hoverable>
                                    <Link to={''}><h5>Information disclosure the Resolution of the Board of Directors regarding the convening of the Annual General Meeting..</h5></Link>
                                    <Link to={''}><p>TransportX Co. Ltd. hereby announce the Resolution of the Board of Directors regarding the convening...</p></Link>
                                    <Link to=''><p>Read more <i className="bi bi-arrow-right"></i></p></Link>
                                </Card>
                                <Card hoverable>
                                    <Link to=''><h5>Official letter of VSD on cancellation of the list of shareholders on 01/01/2024</h5></Link>
                                    <Link to={''}><p>Please click here for more detailed information.</p></Link>
                                    <Link to=''><p>Read more <i className="bi bi-arrow-right"></i></p></Link>
                                </Card>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </section>
            <section className="page-section about-section" id="about">
                <div className="container px-4 px-lg-5">
                    <div className="row gx-4 gx-lg-5">
                        <div className="col">
                            <div className="row">
                                <div className="col-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"
                                         fill="currentColor" className="bi bi-mailbox2-flag"
                                         viewBox="0 0 16 16">
                                        <path
                                            d="M10.5 8.5V3.707l.854-.853A.5.5 0 0 0 11.5 2.5v-2A.5.5 0 0 0 11 0H9.5a.5.5 0 0 0-.5.5v8z"/>
                                        <path
                                            d="M4 3h4v1H6.646A4 4 0 0 1 8 7v6h7V7a3 3 0 0 0-3-3V3a4 4 0 0 1 4 4v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7a4 4 0 0 1 4-4m.585 4.157C4.836 7.264 5 7.334 5 7a1 1 0 0 0-2 0c0 .334.164.264.415.157C3.58 7.087 3.782 7 4 7s.42.086.585.157"/>
                                    </svg>
                                </div>
                                <div className="col-8 about-text">
                                    <h3>2345+</h3>
                                    <h5>Branches in 63 provinces</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="row">
                                <div className="col-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor"
                                         className="bi bi-people" viewBox="0 0 16 16">
                                        <path
                                            d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                                    </svg>
                                </div>
                                <div className="col-8 about-text">
                                    <h3>123.456+</h3>
                                    <h5>Customers trust and use</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="row">
                                <div className="col-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor"
                                         className="bi bi-box2-heart" viewBox="0 0 16 16">
                                        <path
                                            d="M8 7.982C9.664 6.309 13.825 9.236 8 13 2.175 9.236 6.336 6.31 8 7.982"/>
                                        <path
                                            d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4zm0 1H7.5v3h-6zM8.5 4V1h3.75l2.25 3zM15 5v10H1V5z"/>
                                    </svg>
                                </div>
                                <div className="col-8 about-text">
                                    <h3>689.789+</h3>
                                    <h5>Orders are shipping</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="page-section" id="contact">
                <div className="container px-4 px-lg-5">
                    <div className="row gx-4 gx-lg-5 justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h2>Our partners</h2>
                        </div>
                        <Swiper
                            spaceBetween={50}
                            slidesPerView={8}
                            autoplay={{delay: 2000, disableOnInteraction: false}}
                            loop={true}
                            modules={[Autoplay, Pagination, Navigation]}
                        >
                            <SwiperSlide><img src='/img/tiki.png' width={100}/></SwiperSlide>
                            <SwiperSlide><img src='/img/shoppe.png' width={100}/></SwiperSlide>
                            <SwiperSlide><img src='/img/lazada.png' width={100}/></SwiperSlide>
                            <SwiperSlide><img src='/img/tiktok.png' width={100}/></SwiperSlide>
                            <SwiperSlide><img src='/img/fpt.png' width={100}/></SwiperSlide>
                            <SwiperSlide><img src='/img/sendo.png' width={100}/></SwiperSlide>
                            <SwiperSlide><img src='/img/pmct.png' width={100}/></SwiperSlide>
                            <SwiperSlide><img src='/img/media.png' width={100}/></SwiperSlide>
                            <SwiperSlide><img src='/img/hacom.png' width={100}/></SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </section>
            <section className="page-section">

            </section>
            <footer className={'lp-footer'}>
                <div className="container px-4 px-lg-5">
                    <Row>
                    <Col span={12} className={'footer-section'}>
                            <h4>TRANSPORTX EXPRESS CO. LTD.</h4>
                            <h6 className={'text-muted mb-0'}>TransportX is a leading enterprise providing domestic and
                                international express delivery of goods and parcels in Vietnam.</h6>
                            <br/>
                            <h4>Contact Informations:</h4>
                            <h6><i className="bi bi-geo-alt-fill"></i> Headquarter: TransportX Building, No. 8 Ton That
                                Thuyet Street, Nam Tu Liem District, Ha Noi</h6>
                            <h6><i className="bi bi-envelope-open"></i> business@transportx.com</h6>
                            <h6><i className="bi bi-telephone-fill"></i> 1900 8090</h6>

                        </Col>
                        <Col span={6} className={'footer-section'}>
                            <h4>About TransportX</h4>
                            <h6><Link to={''}>About Us</Link></h6>
                            <h6><Link to={''}>Services</Link></h6>
                            <h6><Link to={''}>News</Link></h6>
                            <h6><Link to={''}>Contact</Link></h6>
                            <h6><Link to={''}>Career</Link></h6>
                        </Col>
                        <Col span={6} className={'footer-section'}>
                            <h4>Subscribe Us</h4>
                            <form action="#">
                                <div className="row">
                                    <div className="col-8">
                                        <input type="email" placeholder="Enter your e-mail" required
                                               className="form-control"/>
                                    </div>
                                    <div className="col-4">
                                        <button type="submit" className="form-control btn footer-btn">Submit</button>
                                    </div>
                                </div>
                            </form>
                            <br/>
                            <h4>Follow Us on</h4>
                            <div className="row">
                                <div className="col footer-icons">
                                    <a href="/"><i className="bi bi-facebook"></i></a>
                                </div>
                                <div className="col footer-icons">
                                    <a href="/"><i className="bi bi-twitter"></i></a>
                                </div>
                                <div className="col footer-icons">
                                    <a href="/"><i className="bi bi-linkedin"></i></a>
                                </div>
                                <div className="col footer-icons">
                                    <a href="/"><i className="bi bi-instagram"></i></a>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <hr/>
                    <p className="text-center">©TransportX 2024. All rights reserved</p>
                </div>
            </footer>
        </>
    )
}

export default Home;
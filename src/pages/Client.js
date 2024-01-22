
import '../assets/css/dashboard.css'

import {
    MenuOutlined,
    FileDoneOutlined,
    UserOutlined,
    AppstoreOutlined,
    PlusCircleOutlined,
    FileTextOutlined,
    BarChartOutlined,
    TeamOutlined,
    SearchOutlined,
    HomeOutlined,
    GlobalOutlined,
    SettingOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import {Layout, Menu, Button, theme, Col, Row, Avatar} from 'antd';
import {useState} from "react";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import Dashboard from "../components/Dashboard";
import CreateBill from "../components/CreateBill";
import BillManagement from "../components/BillManagement";
import RevenueStatistics from "../components/RevenueStatistics";
import DeliveryAddresses from "../components/DeliveryAddresses";
import FindPostOffice from "../components/FindPostOffice";
import ShipmentTracking from "../components/ShipmentTracking";
import AccountSetting from "../components/AccountSetting";
import {useDispatch, useSelector} from "react-redux";
import authServices from "../services/auth-service";
import {logOut} from "../actions/authActions";
import ShippingAddresses from "../components/ShippingAddresses";
const { Header, Sider, Content } = Layout;




const Client = () => {
    const user = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

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

    const [collapsed, setCollapsed] = useState(false);


    const generateMenuItems = (item) => {
        if (item.link) {
            return (
                <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.link}>{item.label}</Link>
                </Menu.Item>
            );
        } else if (item.children) {
            return (
                <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                    {item.children.map((child) => (
                        <Menu.Item key={child.key} icon={child.icon}>
                            <Link to={child.link}>{child.label}</Link>
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            );
        }
        return null;
    };

    const menuItems = [
        {
            key: '1',
            icon: <AppstoreOutlined />,
            label: 'Dashboard',
            link: '/client',
        },
        {
            key: '2',
            icon: <PlusCircleOutlined />,
            label: 'Create bill',
            link: '/client/createbill',
        },
        {
            key: '3',
            icon: <FileDoneOutlined />,
            children: [
                {
                    key: '3.1',
                    icon: <FileTextOutlined />,
                    label: 'Bill management',
                    link: '/client/bills',
                },
                {
                    key: '3.2',
                    icon: <BarChartOutlined />,
                    label: 'Revenue Statistics',
                    link: '/client/revenue',
                },
                {
                    key: '3.3',
                    icon: <TeamOutlined />,
                    label: 'Shipping Addresses',
                    link: '/client/shippingadd',
                },
                {
                    key: '3.4',
                    icon: <TeamOutlined />,
                    label: 'Delivery Addresses',
                    link: '/client/deliveryadd',
                },
            ],
            label: 'Manage',
        },
        {
            key: '4',
            icon: <SearchOutlined />,
            children: [
                {
                    key: '4.1',
                    icon: <HomeOutlined />,
                    label: 'Find Post Office',
                    link: '/client/findpo',
                },
                {
                    key: '4.2',
                    icon: <GlobalOutlined />,
                    label: 'Shipment Tracking',
                    link: '/client/track',
                },
            ],
            label: 'Look up',
        },
        {
            key: '5',
            icon: <SettingOutlined />,
            label: 'Account Setting',
            link: '/client/account',
        },
    ];

    const goHome = () => {
        navigate('/')
    };

    const accSetting = () => {
        navigate('/client/account')
    }

    return(
        <Layout>
            <Sider width={"16%"} trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" style={{textAlign: "center"}}>
                    <img
                        src={collapsed ? "/img/small-logo.png" : '/img/full-logo.png'}
                        alt={collapsed ? 'Collapsed Image' : 'Expanded Image'}
                        className={collapsed ? 'collapsed-logo' : 'expanded-logo'}
                        onClick={goHome}
                    />
                </div>
                <Menu defaultSelectedKeys={['1']} mode="inline">
                    {menuItems.map((item) => generateMenuItems(item))}
                </Menu>
            </Sider>
            <Layout>
                <Header
                >
                    <Row>
                        <Col md={6}>
                            <Button
                                style={{ color: '#ffffff',}}
                                type="text"
                                icon={collapsed ? <MenuOutlined style={{ fontSize: '30px', padding: "10px" }}  /> : <MenuOutlined style={{ fontSize: '30px', padding: "10px"  }} />}
                                onClick={() => setCollapsed(!collapsed)}
                            />
                        </Col>
                        <Col md={18} style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            paddingRight: "15px"
                        }}>
                            <Avatar
                                size="default"
                                icon={<UserOutlined style={{cursor: "pointer"}}/>}
                                onClick={accSetting}
                            >
                            </Avatar>
                            <span style={{color: '#ffffff', padding: "0 0 0 10px", cursor: "pointer"}}
                                  onClick={accSetting}>{user.userData.fullname}</span>
                            <Avatar
                                style={{marginLeft: 8, cursor: "pointer"}}
                                size="default"
                                icon={<HomeOutlined/>}
                                onClick={goHome}

                            >
                            </Avatar>
                            <span style={{color: '#ffffff', padding: "0 0 0 10px", cursor: "pointer"}}
                                  onClick={goHome}>Home</span>
                            <Avatar
                                style={{marginLeft: 8, cursor: "pointer"}}
                                size="default"
                                icon={<LogoutOutlined/>}
                                onClick={handleSignOut}
                            >
                            </Avatar>
                            <span style={{color: '#ffffff', padding: "0 0 0 10px", cursor: "pointer"}}
                                  onClick={handleSignOut}>Sign Out</span>
                        </Col>
                    </Row>

                </Header>
                <Content
                >
                    <Routes>
                    <Route path={'/'} element={<Dashboard/>}/>
                        <Route path={'/createbill'} element={<CreateBill/>}/>
                        <Route path={'/bills'} element={<BillManagement/>}/>
                        <Route path={'/revenue'} element={<RevenueStatistics/>}/>
                        <Route path={'/shippingadd'} element={<ShippingAddresses/>}/>
                        <Route path={'/deliveryadd'} element={<DeliveryAddresses/>}/>
                        <Route path={'/findpo'} element={<FindPostOffice/>}/>
                        <Route path={'/track'} element={<ShipmentTracking/>}/>
                        <Route path={'/account'} element={<AccountSetting/>}/>
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    )
};

export default Client;
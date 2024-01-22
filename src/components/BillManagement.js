import '../assets/css/dashboard.css'

import {Button, Col, DatePicker, Empty, Input, Modal, Row, Select, Space, Table} from "antd";
import Search from "antd/es/input/Search";
import { PlusOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import billService from "../services/bill-service";
import {useSelector} from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import {LOGOUT} from "../actions/typesActions";



const BillManagement = () => {
    const user = useSelector(state => state.auth)
    const token = user.userData.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }


    const columns = [
        {
            title: 'Bill Number',
            dataIndex: 'billNumber',
            width: "10%",
        },
        {
            title: 'Nature of goods',
            dataIndex: 'billDetailsDto',
            width: "15%",
            render:(billDetailsDto) => (
                <div>
                    <p>{billDetailsDto.name}</p>
                </div>
            )
        },
        {
            title: 'Consignee',
            dataIndex: 'deliveryAddressDto',
            width: "25%",
            render: (deliveryAddressDto) => (
                <div>
                    <p>{deliveryAddressDto.name}, {deliveryAddressDto.telephone}, {deliveryAddressDto.address}, {deliveryAddressDto.wardName}, {deliveryAddressDto.districtName}, {deliveryAddressDto.provinceName}</p>
                </div>
            )
        },
        {
            title: 'Date created',
            dataIndex: 'dateCreated',
            width: "15%",
            render: (text, record) => (
                <span>{moment(record.dateCreated).format('DD/MM/YYYY HH:mm:ss')}</span>
            ),
        },
        {
            title:'Latest status',
            dataIndex: 'latestStatus',
            width: "20%",
            render: (latestStatus, index) => (
                <div key={index}>
                    <p>{latestStatus.name}</p>
                    <p>At {moment(latestStatus.time).format('DD/MM/YYYY HH:mm:ss')}</p>
                </div>
            )
        },
        {
            title: 'Actions',
            render: (_text: any, record: any) => (
                <Space style={{ justifyContent: 'center' }}>
                    <Button type="primary" onClick={() => showDetailModal(record.id)}>Details</Button>
                    {record.latestStatus.name === 'Created' ? (
                        <Button danger onClick={() => handleCancel(record.id)}>Cancel</Button>
                    ) : (
                        <></>
                        )}
                </Space>
            ),
            width: "15%",
        }
    ];

    const handleDetails = (id: any) => {
        // Handle Details action
        console.log(`Details action for ID ${id}`);
    };





    const onSearchBill = () => {

    }

    const [reportType, setReportType] = useState(1);

    const handleChangeType = (value) => {
        setReportType(value);
        setReportTime(null)
    };
    const typeOptions = [
        {
            value: 1,
            label: 'Date'
        },
        {
            value: 2,
            label: 'Week'
        },
        {
            value: 3,
            label: 'Month'
        }
    ]

    const [reportTime, setReportTime] = useState(null);
    const onChangeTime = (date, dateString) => {
        setReportTime(date)
    };
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    const pickRange = (reportTime, reportType) => {
        const range = dayjs(reportTime);
        let start, end;

        switch (reportType) {
            case 1:
                start = range.startOf('day');
                end = range.endOf('day');
                break;
            case 2:
                start = range.startOf('week').add(1, 'day');
                end = range.endOf('week').add(1, 'day');
                break;
            case 3:
                start = range.startOf('month');
                end = range.endOf('month');
                break;
            default:
                break;
        }
        setStartDate(start.format('YYYY/MM/DD'));
        setEndDate(end.format('YYYY/MM/DD'));
    }

    useEffect(() => {
        pickRange(reportTime, reportType);
    }, [reportTime, reportType])


    const [bills, setBills] = useState([]);
    const data = bills;
    const fetchBills = async () => {
        const data = await billService.getBillsByUser(user.userData.id, startDate, endDate, axiosConfig);
        setBills(data);
    };
    useEffect(() => {

        fetchBills();
    }, [startDate, endDate]);

    const handleExport = () => {

    }
    const handleCancel = async (id) => {
        const billId = id;

        const formData = {billId}
        console.log(formData);
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'The shipment will be cancel permanently!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5ba515',
                cancelButtonColor: '#ee0033',
                confirmButtonText: 'Yes, cancel it!',
            });

            if (result.isConfirmed) {
                await billService.cancelShipment(formData, axiosConfig);
                await Swal.fire({
                    title: 'Successfully!',
                    text: 'Shipment canceled!',
                    icon: 'success',
                    confirmButtonColor: '#5ba515',
                });
                fetchBills();
                setBillDetails({});
            }
        } catch (error) {
            console.error(`Error cancelling shipment.`, error);
            Swal.fire({
                title: 'Cancel error!',
                text: 'An error occurred while cancel shipment!',
                icon: 'error',
                confirmButtonColor: '#ee0033',
            });
        }
    }

    const [billDetails, setBillDetails] = useState({});
    const [openDetail, setOpenDetail] = useState(false);
    const showDetailModal = async (id) => {
        const detail = await billService.getBillDetails(id, axiosConfig);
        setBillDetails(detail);
        setOpenDetail(true);
    };
    const handleDetailCancel = () => {
        setOpenDetail(false);
    };

    return(
        <div className={'db-content'}>
            <h3>Bill management:</h3>
            <hr/>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Space size={12}>
                        <h6>View by: </h6>
                        <Select
                            defaultValue={1}
                            onChange={handleChangeType}
                            style={{
                                minWidth: 120,
                            }}
                            options={typeOptions}
                        />
                        {reportType === 1 ? (
                            <DatePicker onChange={onChangeTime} value={reportTime} />
                        ) : reportType === 2 ? (
                            <DatePicker onChange={onChangeTime} value={reportTime} picker="week" />
                        ) : (
                            <DatePicker onChange={onChangeTime} value={reportTime} picker="month" />
                        )}
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'center' }}>
                    <Input
                        placeholder="Enter bill number, telephone number to find..."
                        allowClear
                        onSearch={onSearchBill}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{textAlign: 'end'}}>
                    {/*<button className={'btn export-btn'} style={{marginRight: "10px"}} onClick={handleExport}>*/}
                    {/*    <i className="bi bi-download" style={{marginRight: "10px"}}></i>*/}
                    {/*    Export to Excel*/}
                    {/*</button>*/}
                    <Link to={'/client/createbill'}>
                        <button className={'btn main-btn'}>
                            <PlusOutlined/> Create new Bill
                        </button>
                    </Link>
                </Col>
            </Row>
            <hr/>
            {Array.isArray(bills) && bills.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record, index) => index}
                    pagination={{
                        pageSize: 15,
                    }}
                    scroll={{
                        y: 600,
                    }}
                />
            ) : (
                <div>
                    <h4 className={'text-center'}>Please select time range to view reports.</h4>
                    <Empty/>
                </div>
            )}
            <Modal
                open={openDetail}
                title="Bill Details"
                onCancel={handleDetailCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleDetailCancel}>
                            Cancel
                        </button>,
                        {/*<button className={"btn btn-warning"} onClick={() => {*/}
                        {/*    showEditModal(accDetails.id);*/}
                        {/*    handleDetailCancel();*/}
                        {/*}}>Edit</button>*/}
                    </Space>
                ]}
            >
                <hr/>
                {Object.keys(billDetails).length !== 0 ? (
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={6}>Bill number</Col>
                            <Col span={18}>{billDetails.billNumber}</Col>
                        </Row>
                        <Row>
                            <Col span={6}>Consignee</Col>
                            <Col span={18}>{billDetails.deliveryAddressDto.name}, {billDetails.deliveryAddressDto.telephone}, {billDetails.deliveryAddressDto.address}, {billDetails.deliveryAddressDto.wardName}, {billDetails.deliveryAddressDto.districtName}, {billDetails.deliveryAddressDto.provinceName}</Col>
                        </Row>
                        <Row>
                            <Col span={6}>Commodity</Col>
                            <Col span={18}>{billDetails.billDetailsDto.name}</Col>
                        </Row>
                        <Row>
                            <Col span={6}>Nature</Col>
                            <Col span={18}>{billDetails.billDetailsDto.nature}</Col>
                        </Row>
                        <Row>
                            <Col span={6}>Weight</Col>
                            <Col span={18}>{billDetails.billDetailsDto.weight} gram</Col>
                        </Row>
                        <Row>
                            <Col span={6}>Dimension</Col>
                            <Col span={18}>{billDetails.billDetailsDto.length} (cm) x {billDetails.billDetailsDto.width} (cm) x {billDetails.billDetailsDto.height} (cm)</Col>
                        </Row>
                        <Row>
                            <Col span={6}>Note</Col>
                            <Col span={18}>{billDetails.note}</Col>
                        </Row>
                        <Row>
                            <Col span={6}>COD</Col>
                            <Col span={18}>$ {billDetails.cod}</Col>
                        </Row>
                        <Row>
                            <Col span={6}>Latest status</Col>
                            <Col span={18}>{billDetails.latestStatus.name} at {moment(billDetails.latestStatus.time).format('DD/MM/YYYY HH:mm:ss')}</Col>
                        </Row>
                    </Space>
                ) : (
                    <div>
                        <Empty/>
                    </div>
                    )}
            </Modal>
        </div>
    )
}

export default BillManagement;
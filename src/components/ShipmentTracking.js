import {Button, Card, Col, Row, Space, Timeline} from "antd";
import Search from "antd/es/input/Search";
import {useState} from "react";
import statusServices from "../services/status-service";
import moment from "moment";


const ShipmentTracking = () => {

    const [status, setStatus] =useState([]);

    const onSearch = async (value) => {
        const status = await statusServices.statusByBill(value);
        setStatus(status);
    }

    return(
        <div className={'db-content'}>
            <h3>Shipment Tracking</h3>
            <hr/>
            <Row>
                <Col span={8} style={{padding: "0 1% 0 0"}}>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Card headStyle={{background: "#dcdcdc"}} type={'inner'} title={'Find bill by bill number: '}>
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Search
                                    placeholder="Enter bill number to track..."
                                    allowClear
                                    enterButton={
                                        <Button
                                            style={{backgroundColor: "#ee0033", color: "#fff", border: "#ee0033"}}
                                        >
                                            Track <i className="bi bi-chevron-double-right"></i>
                                        </Button>
                                    }
                                    size="large"
                                    onSearch={onSearch}
                                />
                            </Space>
                        </Card>
                    </Space>
                </Col>
                <Col span={16} style={{padding: "0 0 0 1%"}}>
                    <Card headStyle={{background: "#dcdcdc"}}
                          type={'inner'}
                          title={'Shipment information: '}
                          style={{minHeight: "130px"}}
                    >
                        <Timeline>
                            {Array.isArray(status) ? (
                                status.map((status, index) => (
                                        <Timeline.Item key={index} color={"#ee0033"}>
                                            <h6>{status.name}</h6>
                                            <p>At {moment(status.time).format('DD/MM/YYYY HH:mm:ss')}</p>
                                        </Timeline.Item>
                                    ))
                            ) : (
                                <Timeline.Item color={"#ee0033"}>
                                    <h6>No Data</h6>
                                </Timeline.Item>
                            )}
                        </Timeline>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ShipmentTracking;
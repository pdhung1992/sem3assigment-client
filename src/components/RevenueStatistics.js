import {Badge, Card, Col, Row, Select, Space, DatePicker, Empty} from "antd";
import Meta from "antd/es/card/Meta";
import {Cell, Legend, Pie, PieChart} from "recharts";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import moment from "moment/moment";
import dayjs from "dayjs";
import reportServices from "../services/report-service";


const RevenueStatistics = () => {

    const user =  useSelector(state => state.auth)
    const id = user.userData.id;
    const token = user.userData.token;
    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }


    const COLORS = [
        'yellow',
        'cyan',
        'blue',
        'purple',
        'orange',
        'lime',
        'green',
        'red',
    ];

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

    const [statusReports, setStatusReports] = useState([]);
    const statusData = Array.isArray(statusReports)
        ? statusReports.map(stt => ({
            name: stt.status,
            value: stt.totalBills
        }))
        : [];

    const [totalBills, setTotalBills] = useState(0);
    const [totalCod, setTotalCod] = useState(0);
    const [totalCharge, setTotalCharge] = useState(0);

    const calcTotal = () => {
        if(Array.isArray(statusReports) && statusReports.length > 0){
            const ttlBill = statusReports.reduce((total, item) => total + item.totalBills, 0);
            const ttlCod = statusReports.reduce((total, item) => total + item.totalCod, 0);
            const ttlCharge = statusReports.reduce((total, item) => total + item.totalCharge, 0);
            const roundedCharge = Math.round(ttlCharge * 100) / 100;
            setTotalBills(ttlBill);
            setTotalCod(ttlCod);
            setTotalCharge(roundedCharge);
        }
    }

    const fetchReports = async () => {
        const reports = await reportServices.userReport(startDate, endDate, axiosConfig);
        setStatusReports(reports);
    }

    useEffect(() => {
        fetchReports();
    }, [startDate, endDate])

    useEffect(() => {
        calcTotal();
    },[statusReports])

    return(
        <div className={'db-content'}>
            <h3>Revenue statistics</h3>
            <hr/>
            <Space size={12}>
                <h6>Report by: </h6>
                <Select
                    defaultValue={1}
                    style={{
                        width: 120,
                    }}
                    onChange={handleChangeType}
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
            <hr/>
            {Array.isArray(statusReports) && statusReports.length > 0 ? (
                <div>
                    <Row>
                        <Col span={8}>
                            <Card
                                hoverable
                                style={{
                                    margin: "5%",
                                    textAlign: "center",
                                    border: "solid 1px #ee0033"
                                }}

                            >
                                <Meta title="Total Bills" description={<h2 style={{color: "#ee0033"}}>{totalBills}</h2>} />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card
                                hoverable
                                style={{
                                    margin: "5%",
                                    textAlign: "center",
                                    border: "solid 1px #ee0033"
                                }}

                            >
                                <Meta title="Total COD" description={<h2 style={{color: "#ee0033"}}>$ {totalCod}</h2>} />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card
                                hoverable
                                style={{
                                    margin: "5%",
                                    textAlign: "center",
                                    border: "solid 1px #ee0033"
                                }}

                            >
                                <Meta title="Total Charge" description={<h2 style={{color: "#ee0033"}}>$ {totalCharge}</h2>} />
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{paddingBottom: "5vh"}}>
                        <Col span={12}>
                            <Card bordered={true}
                                  hoverable
                                  style={{display: "flex", alignItems: "center", justifyContent: "center"}}
                            >
                                {/*<h4 className={"text-center"}>Bill by latest status chart</h4>*/}
                                <PieChart
                                    width={400}
                                    height={400}
                                >
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={120}
                                        outerRadius={160}
                                        fill="#8884d8"
                                        paddingAngle={2}
                                        dataKey="value"
                                        labelLine={false}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                </PieChart>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                hoverable
                            >
                                <h4 className={"text-center"}>Bill by latest status details</h4>
                                <br/>
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th scope="col">Status</th>
                                        <th scope="col">Number of bill</th>
                                        <th scope="col">COD</th>
                                        <th scope="col">Charge</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {statusReports.map((report, index) => (
                                        <tr key={index}>
                                            <th scope="row">
                                                <Badge color={COLORS[index % COLORS.length]} text={report.status}/>
                                            </th>
                                            <td className={'text-center'}>{report.totalBills}</td>
                                            <td>$ {report.totalCod}</td>
                                            <td>$ {report.totalCharge}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </Card>
                        </Col>
                    </Row>
                </div>
            ) : (
                <div>
                    <div>
                        <h4 className={'text-center'}>Please select time range to view reports.</h4>
                        <Empty/>
                    </div>
                </div>
            )}

        </div>
    )
}

export default RevenueStatistics;
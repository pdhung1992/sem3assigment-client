
import '../assets/css/dashboard.css';
import {Card, Checkbox, Col, DatePicker, Row, Tooltip} from "antd";
import {Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import Meta from "antd/es/card/Meta";
import moment from "moment";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import billService from "../services/bill-service";
import {forEach} from "react-bootstrap/ElementChildren";
import dayjs from "dayjs";




const Dashboard = () => {

    const user =  useSelector(state => state.auth)
    const id = user.userData.id;
    const token = user.userData.token;
    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const [month, setMonth] = useState(moment().month() + 1);
    const [year, setYear] = useState(moment().year());


    const [bills, setBills] = useState([]);
    const [totalBills, setTotalBills] = useState('');

    const totalSuccess = Array.isArray(bills) ? bills.filter((bill) => bill.latestStatus.name === 'Delivered').length : 0;
    const totalCancel = Array.isArray(bills) ? bills.filter((bill) => bill.latestStatus.name === 'Cancelled').length : 0;



    const onChangeMonth = (date, dateString) => {
        const selectedMonth = dayjs(dateString, 'YYYY-MM');
        const selectedMonthString = selectedMonth.format('M');
        const selectedYearString = selectedMonth.format('YYYY');

        setMonth(selectedMonthString);
        setYear(selectedYearString);
    };
    const currentMonth = dayjs().startOf('month');

    useEffect(() => {
        const fetchBills = async () => {
            const billsData = await billService.getBillByMonth(id, month, year, axiosConfig);
            setBills(billsData);
            {billsData.length > 0 ? setTotalBills(billsData.length) : setTotalBills(0)}
        };
        fetchBills();
    }, [month])

    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const getDateString = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    const getDatesForMonth = (year, month) => {
        const days = getDaysInMonth(year, month);
        const dates = [];
        for (let i = 1; i <= days; i++) {
            dates.push(getDateString(new Date(year, month - 1, i)));
        }
        return dates;
    };
    const allDates = getDatesForMonth(year, month);

    const counts = allDates.map((date) => {
        const Bills = Array.isArray(bills)
            ? bills.reduce((acc, item) => {
                const itemDate = getDateString(item.dateCreated);
                return itemDate === date ? acc + 1 : acc;
            }, 0)
            : 0;
        return {
            date,
            Bills,
        };
    });

    return(
        <div className={'db-content'}>
            <h3>Dashboard</h3>
            <hr/>
            <h5>View data in  <DatePicker
                defaultValue={currentMonth}
                onChange={onChangeMonth} picker="month"
            /></h5>
            <Card headStyle={{background: "#dcdcdc"}} title={'Bills Statistics '}>
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
                            <Meta title="Success" description={<h2 style={{color: "#ee0033"}}>{totalSuccess}</h2>} />
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
                            <Meta title="Cancel" description={<h2 style={{color: "#ee0033"}}>{totalCancel}</h2>} />
                        </Card>
                    </Col>
                </Row>
                <br/>
                <h6>Bill count by day:</h6>
                <br/>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        data={counts}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="1 1" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Bills" stroke="#ee0033" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    )
}

export default Dashboard;
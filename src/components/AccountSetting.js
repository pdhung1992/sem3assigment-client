import '../assets/css/dashboard.css'
import {Button, Card, Col, Input, Modal, Row, Space} from "antd";
import {CheckOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import Meta from "antd/es/card/Meta";

const AccountSetting = () => {
    return(
        <div className={'db-content'}>
            <h3>Account Setting</h3>
            <hr/>
            <Row>
                <Col span={8}>
                    <Card
                        hoverable
                        style={{
                            margin: "5%",
                            textAlign: "center",
                            background:"#f1e4d3",
                            color: "#ee0033"
                        }}
                        // onClick={() => {showInfoModal()}}
                    >
                        <Meta title={''} description={<img src="/img/info.png" className={'img-fluid'}/>}/>
                        <h5>Account informations</h5>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        hoverable
                        style={{
                            margin: "5%",
                            textAlign: "center",
                            background: "#7fc6fe",
                            color: "#ffffff"
                        }}
                        // onClick={() => {showChangeModal()}}
                    >
                        <Meta title={''} description={<img src="/img/changepwd.jpg" alt=""/>}/>
                        <h5>Change Password</h5>
                    </Card>
                </Col>
            </Row>
            <Modal
                // open={openInfo}
                title="Account informations"
                // onCancel={closeInfo}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} >
                            Close
                        </button>
                    </Space>
                ]}
            >
                <hr/>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Row>
                        <Col span={8}>Username</Col>
                        {/*<Col span={16}>{accountInfo.username}</Col>*/}
                    </Row>
                    <Row>
                        <Col span={8}>Full name</Col>
                        {/*<Col span={16}>{accountInfo.fullname}</Col>*/}
                    </Row>
                    <Row>
                        <Col span={8}>Email</Col>
                        {/*<Col span={16}>{accountInfo.email}</Col>*/}
                    </Row>
                    <Row>
                        <Col span={8}>Role</Col>
                        {/*<Col span={16}>{accountInfo.role}</Col>*/}
                    </Row>
                    <Row>
                        <Col span={8}>Branch</Col>
                        {/*<Col span={16}>{accountInfo.postOffice}</Col>*/}
                    </Row>
                </Space>
            </Modal>
            <Modal
                // open={openChange}
                title="Change Password"
                // onCancel={handleChangeCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} >
                            Cancel
                        </button>,
                        <button className={'btn main-btn'} type={"submit"} >
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={8}>Current Password</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Current Password...'
                                       // value={changeData.currentPassword}
                                       type='password'
                                       name='currentPassword'
                                       // onChange={onChangeData}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>New Password</Col>
                            <Col span={16}>
                                <Input placeholder='Enter New Password...'
                                       type='password'
                                       // value={changeData.newPassword}
                                       name='newPassword'
                                       // onChange={onChangeData}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Confirm new Password</Col>
                            <Col span={16}>
                                <Input placeholder='Confirm new Password...'
                                       type='password'
                                       // value={changeData.newPasswordCfm}
                                       name='newPasswordCfm'
                                       // onChange={onChangeData}
                                />
                            </Col>
                        </Row>
                    </Space>
                </form>
            </Modal>
        </div>
    )
}

export default AccountSetting;
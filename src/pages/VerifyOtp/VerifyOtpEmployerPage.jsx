// VerifyOtp.js

import React from "react";
import { Button, Col, Form, Input, notification, Row } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpEmployer } from "../../Api/api";
import "./VerifyOtp.scss"

const VerifyOtpEmployer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, username, password } = location.state || {}; // Get email from state passed by RegisterUser

    const onFinish = async (values) => {
        const { otp } = values;

        try {
            const res = await verifyOtpEmployer(email, otp, password, username);

            if (res.status === 200) {
                notification.success({
                    message: "OTP Verification",
                    description: "Employer verified successfully",
                });
                navigate("/login-employer"); // Redirect to login page after verification
            }
        } catch (error) {
            notification.error({
                message: "OTP Verification",
                description:
                    error.response?.data?.message || "OTP verification failed",
            });
        }
    };

    return (
        <div className="verify-otp-container">
            <Row justify={"center"} style={{ marginTop: "30px" }}>
                <Col xs={24} md={16} lg={8}>
                    <fieldset
                        style={{
                            padding: "15px",
                            margin: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                    >
                        <legend>Verify OTP</legend>
                        <Form
                            name="verifyOtp"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item
                                label="OTP"
                                name="otp"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your OTP!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Verify OTP
                                </Button>
                            </Form.Item>
                        </Form>
                    </fieldset>
                </Col>
            </Row>
        </div>
    );
};

export default VerifyOtpEmployer;

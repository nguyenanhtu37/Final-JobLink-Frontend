// VerifyOtp.js
import React from "react";
import { Button, Col, Form, Input, notification, Row } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../Api/api"; // Adjust import path as needed

const VerifyOtpForgotPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, newPassword } = location.state || {}; // Get email and newPassword from state

    const onFinish = async (values) => {
        const { otp } = values;

        try {
            await forgotPassword(email, otp, newPassword); // Call the API to reset password
            notification.success({ message: "Password reset successful!" });
            navigate("/login-user"); // Redirect to login page after successful reset
        } catch (error) {
            notification.error({
                message:
                    error.response?.data?.message ||
                    "Error resetting password.",
            });
        }
    };

    return (
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
                    <legend>Verify Forgot Password</legend>
                    <Form onFinish={onFinish} layout="vertical">
                        <Form.Item
                            name="otp"
                            label="Enter OTP"
                            rules={[{ required: true }]}
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
    );
};

export default VerifyOtpForgotPage;

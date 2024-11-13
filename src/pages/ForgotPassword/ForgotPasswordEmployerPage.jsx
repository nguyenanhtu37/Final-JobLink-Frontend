// PasswordReset.js
import React, { useState } from "react";
import { Button, Col, Form, Input, notification, Row } from "antd";
import { sendOtpForForgotPassword } from "../../Api/api"; // Adjust import path as needed
import { useNavigate } from "react-router-dom";

const ForgotPasswordEmployerPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        const { email, newPassword, confirmPassword } = values;

        if (newPassword !== confirmPassword) {
            notification.error({ message: "Passwords do not match!" });
            return;
        }

        setLoading(true);
        try {
            const res = await sendOtpForForgotPassword(email);

            if (res.status === 200) {
                notification.success({ message: "OTP sent to email." });
                navigate("/verify-otp-forgot-employer", {
                    state: { email, newPassword },
                });
            }
        } catch (error) {
            notification.error({
                message: error.response?.data?.message || "Error sending OTP.",
            });
        } finally {
            setLoading(false);
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
                    <legend>Forgot Password</legend>
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[{ required: true }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm New Password"
                            rules={[{ required: true }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                Send OTP
                            </Button>
                        </Form.Item>
                    </Form>
                </fieldset>
            </Col>
        </Row>
    );
};

export default ForgotPasswordEmployerPage;

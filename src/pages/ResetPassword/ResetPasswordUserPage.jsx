import React, { useState } from "react";
import { Button, Col, Form, Input, notification, Row } from "antd";
import { sendOtpResetPassword } from "../../Api/api"; // Adjust import path as needed
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ResetPasswordUserPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const account = useSelector((state) => state.user.account);

    const onFinish = async (values) => {
        const { password, newPassword, confirmPassword } = values;

        if (newPassword !== confirmPassword) {
            notification.error({ message: "Passwords do not match!" });
            return;
        }

        setLoading(true);
        try {
            // Correctly send email and password in the object
            const res = await sendOtpResetPassword(
                account.email, // Ensure you're extracting the email correctly
                password
            );

            console.log(res);

            if (res.status === 200) {
                notification.success({ message: "OTP sent to email." });
                navigate("/verify-reset-password-user", {
                    state: { email: account.email, newPassword },
                });
            } else if (res.message === "Incorrect Password") {
                notification.error({ message: res.message });
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
        <Row justify={"center"} style={{ marginTop: "200px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset
                    style={{
                        padding: "15px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                >
                    <legend>Reset Password</legend>
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item
                            name="password"
                            label="Current Password"
                            rules={[{ required: true }]}
                        >
                            <Input.Password />
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

export default ResetPasswordUserPage;

import { Button, Col, Form, Input, message, notification, Row } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../Api/api";
import { updateUserSuccess } from "../../redux/action/userAction";

const ProfileEmployer = () => {
    const account = useSelector((state) => state.user.account);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        console.log("Form submitted:", values);
        try {
            const updateData = {
                username: values.username,
            };

            const res = await updateUser(account.id, updateData);

            console.log(res);
            dispatch(updateUserSuccess(res.username));

            // Show a success notification
            notification.success({
                message: "Update User",
                description: "User updated successfully.",
            });
        } catch (error) {
            console.error("Update failed", error);
            message.error("Failed to update user");
        }
    };

    return (
        <div style={{width: "100%"}}>
            {isAuthenticated ? (
                <div>
                    <Row
                        justify={"center"}
                        style={{ paddingTop: "200px" }}
                    >
                        <Col xs={24} md={16} lg={8}>
                            <fieldset
                                style={{
                                    padding: "15px",
                                    margin: "5px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                }}
                            >
                                <legend>Profile</legend>
                                <Form
                                    name="profileForm"
                                    onFinish={onFinish}
                                    autoComplete="off"
                                    layout="vertical"
                                    initialValues={{
                                        email: account.email, // Pre-fill email
                                        username: account.username, // Pre-fill username
                                    }}
                                >
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your email!",
                                            },
                                        ]}
                                    >
                                        <Input disabled />
                                    </Form.Item>

                                    <Form.Item
                                        label="Username"
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your username!",
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            Update
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </fieldset>
                        </Col>
                    </Row>
                </div>
            ) : (
                <div>No user found.</div>
            )}
        </div>
    );
};

export default ProfileEmployer;

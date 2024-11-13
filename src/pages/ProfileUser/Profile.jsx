import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Col, Form, Input, message, notification, Row, Select } from "antd";
import axios from "axios";
import { updateUserSuccess } from "../../redux/action/userAction";
import { updateUser } from "../../Api/api";

const Profile = () => {
    const account = useSelector((state) => state.user.account);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const dispatch = useDispatch();
    const [professionOptions, setProfessionOptions] = useState([]);

    useEffect(() => {
        // Fetch profession options on component mount
        axios.get('http://localhost:8080/v1/api/admin/profession')
            .then(response => {
                setProfessionOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching profession options', error);
            });
    }, []);

    const onFinish = async (values) => {
        console.log("Form submitted:", values);
        try {
            const updateData = {
                username: values.username,
                professionId: values.professionId,
                jobInput: values.jobInput 
            };

            const res = await updateUser(account.id, updateData);

            console.log(res);
            dispatch(updateUserSuccess(res.username));

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
        <div>
            {isAuthenticated ? (
                <div>
                    <Row justify={"center"} style={{ paddingTop: "200px" }}>
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
                                        email: account.email,
                                        username: account.username,
                                        professionId: account.professionId, 
                                        jobInput: account.jobInput, 
                                    }}
                                >
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ required: true, message: "Please input your email!" }]}
                                    >
                                        <Input disabled />
                                    </Form.Item>

                                    <Form.Item
                                        label="Username"
                                        name="username"
                                        rules={[{ required: true, message: "Please input your username!" }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Profession"
                                        name="professionId" 
                                        rules={[{ message: "Please select your profession!" }]}
                                    >
                                        <Select placeholder="Select a profession">
                                            {professionOptions.map((option) => (
                                                <Select.Option key={option._id} value={option._id}>
                                                    {option.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Job Title"
                                        name="jobInput"
                                    >
                                        <Input placeholder="Nhập từ khóa liên quan đến công việc mà bạn đang quan tâm" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
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

export default Profile;

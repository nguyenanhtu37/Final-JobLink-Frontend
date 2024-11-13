import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createCompany, getCompany } from "../../Api/api";
import {
    Form,
    Input,
    Button,
    Upload,
    message,
    Typography,
    Row,
    Col,
    Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./ManageCompany.scss";

const { Title } = Typography;

const ManageCompany = () => {
    const account = useSelector((state) => state.user.account);
    const [dataCompany, setDataCompany] = useState({});
    const [logo, setLogo] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        number_of_employee: "",
        introduction: "",
        location: "",
        website: "",
        isPublic: false,
        employer: account.id,
    });

    const { name, number_of_employee, location, introduction, website } =
        formData;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (info) => {
        if (info.fileList.length > 0) {
            setLogo(info.fileList[0]); // Store the first file from the uploaded files
        }
    };

    const handleSubmit = async (values) => {
        const data = new FormData();
        data.append("name", values.name);
        data.append("number_of_employee", values.number_of_employee);
        data.append("location", values.location);
        data.append("introduction", values.introduction);
        data.append("website", values.website);
        data.append("isPublic", false);
        data.append("employer", formData.employer);

        // Check if logo is defined before appending it
        if (logo) data.append("logo", logo.originFileObj); // Use originFileObj for the actual file

        try {
            await createCompany(data);
            message.success("Company created successfully!");
            fetchCompany();
        } catch (err) {
            message.error("Failed to create company.");
        }
    };

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        const res = await getCompany(account.id);
        setDataCompany(res);
    };

    console.log(dataCompany);

    if (dataCompany.message === "Company not found") {
        return (
            <div className="create-company-container">
                <Title level={2}>Create Company</Title>
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Company Name" name="name" required>
                        <Input value={name} onChange={handleChange} />
                    </Form.Item>
                    <Form.Item
                        label="Staff Number"
                        name="number_of_employee"
                        required
                    >
                        <Input
                            type="number"
                            value={number_of_employee}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label="Link Website" name="website" required>
                        <Input value={website} onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Address" name="location" required>
                        <Input value={location} onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Description" name="introduction" required>
                        <Input.TextArea
                            value={introduction}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label="Logo">
                        <Upload
                            beforeUpload={() => false} // Prevent automatic upload
                            onChange={handleFileChange} // Handle file change
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>
                                Upload Logo
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create Company
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    return (
        <div className="company-info-container">
            <Row justify={"center"} style={{ marginTop: "30px", width: "1000px" }}>
                <Col xs={24} md={16} lg={12}>
                    <Card
                        title={<Title level={2}>Company Information</Title>}
                        bordered
                    >
                        <Form layout="vertical">
                            <Form.Item label="Name">
                                <Input value={dataCompany.name} disabled />
                            </Form.Item>
                            <Form.Item label="Description">
                                <Input.TextArea
                                    value={dataCompany.introduction}
                                    rows={3}
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item label="Address">
                                <Input value={dataCompany.location} disabled />
                            </Form.Item>
                            <Form.Item label="Number of Employees">
                                <Input
                                    value={dataCompany.number_of_employee}
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item label="Link Website">
                                <Input value={dataCompany.website} disabled />
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ManageCompany;

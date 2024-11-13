import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getJobById, updateJob } from '../../../Api/api'; // Ensure you import the updateJob function
import { Form, Input, Button, Select } from 'antd';
import './ViewDetailJob.scss'; // Import updated SCSS styles

const ViewDetailJob = () => {
  const { id } = useParams();
  const [dataJob, setDataJob] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getJobById(id);
    setDataJob(res.job);
    form.setFieldsValue(res.job); // Populate form fields with job data
  };

  const onFinish = async (values) => {
    try {
      await updateJob(id, values); // Call the updateJob API
      alert('Job updated successfully!');
      navigate('/postjob/list-jobs'); // Navigate back to job list after update
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('Failed to update job. Please try again.');
    }
  };

  return (
    <div className="job-detail-container">
      <div className="job-header">
        <div className="job-btn" onClick={() => navigate('/postjob/list-jobs')}>
          Back
        </div>
        <h2 className="job-title">Update Job: {dataJob.title}</h2>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="job-update-form"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input the job title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the job description!' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Requirements"
          name="requirement"
          rules={[{ required: true, message: 'Please input the job requirements!' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Benefits" name="benefit">
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Location"
          name="detailed_location"
          rules={[{ required: true, message: 'Please input the job location!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Province/City"
          name="province_city"
          rules={[{ required: true, message: 'Please input the province/city!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Working Time"
          name="working_time"
          rules={[{ required: true, message: 'Please input the working time!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Salary"
          name="salary"
          rules={[{ required: true, message: 'Please input the salary!' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Experience"
          name="experience"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Level"
          name="level"
          rules={[{ required: true, message: 'Please input the job level!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: 'Please input the quantity!' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Working Type"
          name="working_type"
          rules={[{ required: true, message: 'Please input the working type!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Gender Requirement"
          name="sex"
        >
          <Select>
            <Select.Option value="Không yêu cầu">Không yêu cầu</Select.Option>
            <Select.Option value="Nam">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Job
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ViewDetailJob;

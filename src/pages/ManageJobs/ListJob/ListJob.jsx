import React, { useEffect, useState } from "react";
import { deleteJob, getJobByEmployerId } from "../../../Api/api";
import { useSelector } from "react-redux";
import { Button, message, Table } from "antd";
import "./ListJob.scss";
import { useNavigate } from "react-router-dom";

const ListJob = () => {
    const account = useSelector((state) => state.user.account);
    const [publicJobs, setPublicJobs] = useState([]);   // Jobs where isPublic is true
    const [privateJobs, setPrivateJobs] = useState([]); // Jobs where isPublic is false
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await getJobByEmployerId(account.id);
            const publicJobs = res.filter((job) => job.isPublic); // Jobs with isPublic true
            const privateJobs = res.filter((job) => !job.isPublic); // Jobs with isPublic false
            setPublicJobs(publicJobs);
            setPrivateJobs(privateJobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };

    const handleViewDetail = (jobId) => {
        navigate(`/postjob/job-detail/${jobId}`);
    };

    const handleDelete = async (jobId) => {
        try {
            await deleteJob(jobId);
            message.success("Delete Success");
            fetchJobs(); // Refresh job list after deletion
        } catch (error) {
            console.log(error);
        }
    };

    const handleListApplication = async (jobId) => {
        navigate(`/postjob/list-application/${jobId}`)
    }

    // Define common columns for both tables
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Detailed Location',
            dataIndex: 'detailed_location',
            key: 'detailed_location',
        },
        {
            title: 'Due Date',
            dataIndex: 'due_to',
            key: 'due_to',
            render: (due_to) => new Date(due_to).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "action",
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => handleViewDetail(record.key)}>
                        Edit
                    </Button>
                    <Button type="second" onClick={() => handleDelete(record.key)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    // Columns for public jobs (with Applications button)
    const publicColumns = [
        ...columns,
        {
            title: "Applications",
            key: "applications",
            render: (text, record) => (
                <Button type="primary" onClick={() => handleListApplication(record.key)}>
                    View Applications
                </Button>
            ),
        },
    ];

    // Map public and private job data to the dataSource format for their respective tables
    const publicData = publicJobs.map((job) => ({
        key: job._id,
        title: job.title,
        description: job.description,
        detailed_location: job.detailed_location,
        due_to: job.due_to,
    }));

    const privateData = privateJobs.map((job) => ({
        key: job._id,
        title: job.title,
        description: job.description,
        detailed_location: job.detailed_location,
        due_to: job.due_to,
    }));

    return (
        <div className="list-jobs-company">
            <div className="title">Public Jobs</div>
            <Table columns={publicColumns} dataSource={publicData} />

            <div className="title">Private Jobs</div>
            <Table columns={columns} dataSource={privateData} />
        </div>
    );
};

export default ListJob;

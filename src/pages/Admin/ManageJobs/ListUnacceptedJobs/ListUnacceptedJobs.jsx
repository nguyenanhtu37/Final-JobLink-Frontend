import React, { useEffect, useState } from "react";
import { acceptJob, getUnacceptedJob } from "../../../../Api/api";
import { Table, Button, message } from "antd"; // Import Button and message

const ListUnacceptedJobs = () => {
    const [dataJob, setDataJob] = useState([]);

    useEffect(() => {
        fetchJob(); // Fixed typo from fectchJob to fetchJob
    }, []);

    const fetchJob = async () => {
        try {
            const res = await getUnacceptedJob();
            setDataJob(res.jobs || []); // Ensure it's an array, even if `res.jobs` is undefined
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setDataJob([]); // Set an empty array on error
        }
    };

    // Handle reject job
    const handleReject = (jobId) => {
        message.error(`Job ${jobId} rejected!`);
        fetchJob();
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Detailed Location",
            dataIndex: "detailed_location",
            key: "detailed_location",
        },
        {
            title: "Is Public",
            dataIndex: "isPublic",
            key: "isPublic",
            render: (isPublic) => (isPublic ? "Public" : "Private"),
        },
        {
            title: "Due Date",
            dataIndex: "due_to",
            key: "due_to",
            render: (due_to) => new Date(due_to).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "action",
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => handleAccept(record.key)}>
                        Accept
                    </Button>
                    <Button type="danger" onClick={() => handleReject(record.key)} style={{ marginLeft: 8 }}>
                        Reject
                    </Button>
                </>
            ),
        },
    ];

    // Map job data to the dataSource format for the table, safely handling an empty `dataJob`
    const data = dataJob?.map((job) => ({
        key: job._id,
        title: job.title,
        description: job.description,
        detailed_location: job.detailed_location,
        isPublic: job.isPublic,
        due_to: job.due_to,
    })) || [];

    const handleAccept = async (jobId) => {
        try {
            await acceptJob(jobId); // Call the API to accept the job
            message.success(`Job ${jobId} accepted!`);
            fetchJob(); // Refresh the job list
        } catch (error) {
            message.error(`Error accepting job: ${error.message}`);
        }
    };

    return (
        <div className="list-jobs-company">
            <div className="title">List Jobs</div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
};

export default ListUnacceptedJobs;

import React, { useEffect, useState } from "react";
import { acceptJob, getAcceptedJob, getUnacceptedJob } from "../../../../Api/api";
import { Table, Button, message } from "antd"; // Import Button and message

const ListAcceptedJobs = () => {
    const [dataJob, setDataJob] = useState([]);

    useEffect(() => {
        fetchJob(); // Fixed typo from fectchJob to fetchJob
    }, []);

    const fetchJob = async () => {
        const res = await getAcceptedJob();
        setDataJob(res.jobs);
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
    ];

    // Map job data to the dataSource format for the table
    const data = dataJob.map((job) => ({
        key: job._id, // Unique key for each job
        title: job.title,
        description: job.description,
        detailed_location: job.detailed_location,
        isPublic: job.isPublic,
        due_to: job.due_to,
    }));

    return (
        <div className="list-jobs-company">
            <div className="title">List Jobs</div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
};

export default ListAcceptedJobs;

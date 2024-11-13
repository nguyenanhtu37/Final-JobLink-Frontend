import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationByJob, acceptApplication, rejectApplication } from "../../../Api/api";
import { Button, Table, message, Empty } from "antd";
import "./ListApplication.scss";

const ListApplication = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [dataApplication, setDataApplication] = useState([]);

    useEffect(() => {
        fetchApplication();
    }, []);

    const fetchApplication = async () => {
        try {
            const res = await getApplicationByJob(id);
            console.log(res);
            if (res.applications) {
                setDataApplication(res.applications);
            } else {
                setDataApplication([]);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const handleAccept = async (applicationId, userId) => {
        try {
            // Call the acceptApplication function with the applicationId and userId
            await acceptApplication(applicationId, { userId });
            message.success("Application accepted successfully.");
            fetchApplication(); // Refresh the application list
        } catch (error) {
            console.error("Error accepting application:", error);
            message.error("Failed to accept application.");
        }
    };
    
    const handleReject = async (applicationId, userId) => {
        try {
            // Call the rejectApplication function with the applicationId and userId
            await rejectApplication(applicationId, { userId });
            message.success("Application rejected successfully.");
            fetchApplication(); // Refresh the application list
        } catch (error) {
            console.error("Error rejecting application:", error);
            message.error("Failed to reject application.");
        }
    };

    const columns = [
        {
            title: "Application ID",
            dataIndex: "_id",
            key: "_id",
        },
        {
            title: "Job Title",
            dataIndex: "jobId",
            key: "jobId",
            render: (job) => job.title, // Access job title
        },
        {
            title: "User Username",
            dataIndex: "userId",
            key: "userId",
            render: (user) => user.username, // Access user username
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <div>
                    {record.status === 'pending' ? (
                        <>
                            <Button type="primary" onClick={() => handleAccept(record._id, record.userId)}>Accept</Button>
                            <Button type="danger" onClick={() => handleReject(record._id, record.userId)}>Reject</Button>
                        </>
                    ) : (
                        <span>{record.status}</span> // Show status if accepted or rejected
                    )}
                </div>
            ),
        },
    ];

    // Filter applications by status
    const pendingApplications = dataApplication.filter(application => application.status === 'pending');
    const acceptedApplications = dataApplication.filter(application => application.status === 'accept');
    const rejectedApplications = dataApplication.filter(application => application.status === 'reject');

    // Map application data for table format
    const formatData = (applications) => applications.map((application) => ({
        key: application._id,
        jobId: application.jobId,
        _id: application._id,
        userId: application.userId,
        status: application.status, // Ensure status is included
    }));

    return (
        <div className="list-applications">
            <div className="back" onClick={() => navigate("/postjob/list-jobs")}>
                Back
            </div>
            <div className="title">List of Applications</div>

            {/* Pending Applications Table */}
            <div className="table-section">
                <h3>Pending Applications</h3>
                {pendingApplications.length === 0 ? (
                    <Empty description="No pending applications" />
                ) : (
                    <Table columns={columns} dataSource={formatData(pendingApplications)} />
                )}
            </div>

            {/* Accepted Applications Table */}
            <div className="table-section">
                <h3>Accepted Applications</h3>
                {acceptedApplications.length === 0 ? (
                    <Empty description="No accepted applications" />
                ) : (
                    <Table columns={columns} dataSource={formatData(acceptedApplications)} />
                )}
            </div>

            {/* Rejected Applications Table */}
            <div className="table-section">
                <h3>Rejected Applications</h3>
                {rejectedApplications.length === 0 ? (
                    <Empty description="No rejected applications" />
                ) : (
                    <Table columns={columns} dataSource={formatData(rejectedApplications)} />
                )}
            </div>
        </div>
    );
};

export default ListApplication;

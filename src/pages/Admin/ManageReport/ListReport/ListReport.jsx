import { Button, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getReportById, getReports } from "../../../../Api/api";

const ListReports = () => {
    const [dataReports, setDataReports] = useState([]);
    const [dataReport, setDataReport] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await getReports();
            console.log(res);
            setDataReports(
                res.map((report) => ({ ...report, key: report._id }))
            );
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    const fetchReport = async (reportId) => {
        try {
            const res = await getReportById(reportId);
            setDataReport(res);
            setIsModalVisible(true);
        } catch (error) {
            console.error("Error fetching report:", error);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setDataReport(null);
    };

    const columns = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Actions",
            key: "action",
            render: (text, record) => (
                <Button type="primary" onClick={() => fetchReport(record._id)}>
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <>
            <div
                className="list-reports"
                style={{ width: "100%", padding: "30px" }}
            >
                <div
                    className="title"
                    style={{
                        fontSize: "30px",
                        fontWeight: "700",
                        marginBottom: "50px",
                    }}
                >
                    List Reports
                </div>
                <Table columns={columns} dataSource={dataReports} />
            </div>

            <Modal
                title="Report Details"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>,
                ]}
            >
                {dataReport && (
                    <div>
                        <p>
                            <strong>Job Title:</strong>{" "}
                            {dataReport.jobId?.title || "N/A"}
                        </p>
                        <p>
                            <strong>Username:</strong> {dataReport.username}
                        </p>
                        <p>
                            <strong>Phone:</strong> {dataReport.phone}
                        </p>
                        <p>
                            <strong>Email:</strong> {dataReport.email}
                        </p>
                        <p>
                            <strong>Description:</strong>{" "}
                            {dataReport.description}
                        </p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ListReports;

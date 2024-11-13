import { Button, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getFeedbackById, getFeedbacks } from "../../../../Api/api";

const ListFeedbacks = () => {
    const [dataFeedbacks, setDataFeedbacks] = useState([]);
    const [dataFeedback, setDataFeedback] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const res = await getFeedbacks();
            console.log(res)
            setDataFeedbacks(
                res.map((feedback) => ({ ...feedback, key: feedback._id }))
            );
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };

    const fetchFeedback = async (feedbackId) => {
        try {
            const res = await getFeedbackById(feedbackId);
            setDataFeedback(res);
            setIsModalVisible(true);
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setDataFeedback(null);
    };

    const columns = [
        {
            title: "Feedback Name",
            dataIndex: "feedbackName",
            key: "feedbackName",
        },
        {
            title: "User",
            dataIndex: "userId",
            key: "userId",
            render: (userId) => userId?.username || "N/A",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => new Date(createdAt).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "action",
            render: (text, record) => (
                <Button
                    type="primary"
                    onClick={() => fetchFeedback(record._id)}
                >
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <>
            <div
                className="list-feedbacks"
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
                    List Feedbacks
                </div>
                <Table columns={columns} dataSource={dataFeedbacks} />
            </div>

            <Modal
                title="Feedback Details"
                open={isModalVisible} // Use `open` to avoid deprecated warning
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>,
                ]}
            >
                {dataFeedback && (
                    <div>
                        <p>
                            <strong>Feedback Name:</strong>{" "}
                            {dataFeedback.feedbackName}
                        </p>
                        <p>
                            <strong>User:</strong>{" "}
                            {dataFeedback.userId?.username || "N/A"}
                        </p>
                        <p>
                            <strong>Description:</strong>{" "}
                            {dataFeedback.description}
                        </p>
                        <p>
                            <strong>Created At:</strong>{" "}
                            {new Date(
                                dataFeedback.createdAt
                            ).toLocaleDateString()}
                        </p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ListFeedbacks;

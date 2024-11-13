import { Button, Modal, notification, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getAllUsers, getUserById, toggleUserBlockStatus } from "../../../Api/api";

const ListUsers = () => {
    const [dataUsers, setDataUsers] = useState([]);
    const [dataUser, setDataUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getAllUsers();
            console.log(res)
            setDataUsers(res.map(user => ({ ...user, key: user._id }))); // Ensure each user has a unique key
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchUser = async (userId) => {
        try {
            const res = await getUserById(userId);
            setDataUser(res);
            setIsModalVisible(true);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setDataUser(null);
    };

    const toggleBlockStatus = async (userId) => {
        try {
            const res = await toggleUserBlockStatus(userId);
            console.log(res); // Log the entire response to inspect it
            
            if (res.message === "User isBlock status updated to false" || res.message === "User isBlock status updated to true") {
                notification.success({
                    message: "Account Status Updated",
                    description: `Account is now ${res.user.isBlock ? "Blocked" : "Active"}`, // Correctly access res.user.isBlock
                });
                fetchData();
            }
        } catch (error) {
            console.error("Error toggling block status:", error);
            notification.error({
                message: "Error",
                description: "Failed to update user status",
            });
        }
    };

    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Status",
            dataIndex: "isBlock",
            key: "isBlock",
            render: (isBlock) => (isBlock ? "Blocked" : "Active"),
        },
        {
            title: "Actions",
            key: "action",
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => fetchUser(record._id)}>
                        View
                    </Button>
                    <Button type="default" onClick={() => toggleBlockStatus(record._id)}>
                        {record.isBlock ? "Unblock" : "Block"}
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <div
                className="list-accounts"
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
                    List Users
                </div>
                <Table columns={columns} dataSource={dataUsers} />
            </div>

            <Modal
                title="User Details"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>,
                ]}
            >
                {dataUser && (
                    <div>
                        <p><strong>Email:</strong> {dataUser.email}</p>
                        <p><strong>Username:</strong> {dataUser.username}</p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ListUsers;

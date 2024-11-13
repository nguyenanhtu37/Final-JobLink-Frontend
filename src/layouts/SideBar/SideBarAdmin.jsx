import React from "react";
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogout } from "../../redux/action/userAction";

const SideBarAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(doLogout());
        navigate("/");
    };

    const items = [
        {
            label: <Link to="/admin">Dash Board</Link>,
            key: "sub1",
        },
        {
            type: "divider",
        },
        {
            key: "sub2",
            label: "List Accounts",
            icon: <MailOutlined />,
            children: [
                {
                    key: "1",
                    label: <Link to="/admin/list-users">User Accounts</Link>,
                },
                {
                    key: "2",
                    label: <Link to="/admin/list-employers">Employer Accounts</Link>,
                },
            ],
        },
        {
            type: "divider",
        },
        {
            key: "sub3",
            label: "List Jobs",
            icon: <MailOutlined />,
            children: [
                {
                    key: "3",
                    label: <Link to="/admin/list-no-public-job">List Unaccepted Jobs</Link>,
                },
                {
                    key: "4",
                    label: <Link to="/admin/list-public-job">List Accepted Jobs</Link>,
                },
            ],
        },
        {
            type: "divider",
        },
        {
            key: "sub4",
            label: <Link to="/admin/consultations">Consultations</Link>,
            icon: <AppstoreOutlined />,
        },
        {
            type: "divider",
        },
        {
            key: 'sub5',
            label: <Link to="/admin/list-reports">Manage Reports</Link>,
            icon: <MailOutlined />,
        },
        {
            type: "divider",
        },
        {
            key: "sub6",
            label: <Link to="/admin/system-feedbacks">System Feedbacks</Link>,
            icon: <SettingOutlined />,
        },
        {
            type: "divider",
        },
        {
            key: 'sub7',
            label: <Link to="/admin/list-feedbacks">Manage Feedbacks</Link>,
            icon: <MailOutlined />,
        },
        {
            label: <span onClick={handleLogout}>Log out</span>,
            key: "logout",
        },
    ];

    return (
        <Menu
            style={{
                width: 256,
                minHeight: "100vh",
            }}
            defaultSelectedKeys={["sub1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
        />
    );
};
export default SideBarAdmin;

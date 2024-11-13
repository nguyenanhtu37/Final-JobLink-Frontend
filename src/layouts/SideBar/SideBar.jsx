import React from "react";
import {
    AppstoreOutlined,
    MailOutlined,
    LogoutOutlined,
    SettingOutlined,
    ProfileOutlined,
    HomeOutlined,
    CheckCircleOutlined,
    VideoCameraOutlined,  // Thêm icon cho Interview
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogout } from "../../redux/action/userAction";

const SideBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(doLogout());
        navigate("/homepostjob");
    };

    const items = [
        {
            key: "dashboard",
            label: <Link to="/postjob">Dash Board</Link>,
            icon: <HomeOutlined />
        },
        {
            type: "divider",
        },
        {
            key: "sub1",
            label: "Manage Jobs",
            icon: <MailOutlined />,
            children: [
                {
                    key: "1",
                    label: <Link to="list-jobs">List Jobs</Link>,
                },
                {
                    key: "2",
                    label: <Link to="add-job">Add Job</Link>,
                },
            ],
        },
        {
            type: "divider",
        },
        {
            key: "sub2",
            label: <Link to="/postjob/manage-company">Manage Company</Link>,
            icon: <AppstoreOutlined />,
        },
        {
            type: "divider",
        },
        {
            key: "interview",  
            label: <Link to="/employer-interview">Interview</Link>,
            icon: <VideoCameraOutlined />, 
        },
        {
            type: "divider",
        },
        {
            key: "setting",
            label: "Setting",
            icon: <SettingOutlined />,
            children: [            
                {
                    key: "profile",
                    label: <Link to="profile-employer">Profile</Link>,
                    icon: <ProfileOutlined />
                },
                {
                    type: "divider",
                },
                {
                    label: <span onClick={handleLogout}>Log out</span>,
                    key: "logout",
                    icon: <LogoutOutlined />
                },
            ],
        },
    ];

    return (
        <Menu
            style={{
                width: 256,
                minHeight: "100vh",
            }}
            defaultSelectedKeys={["dashboard"]}
            defaultOpenKeys={["dashboard"]}
            mode="inline"
            items={items}
        />
    );
};
export default SideBar;

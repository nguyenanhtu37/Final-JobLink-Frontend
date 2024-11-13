import { Card } from "antd";
import React from "react";
import {UserOutlined} from "@ant-design/icons";
import { useSelector } from "react-redux";
import "./DashBoardEmployer.scss"
import { useNavigate } from "react-router-dom";

const DashBoardEmployer = () => {
    const navigate = useNavigate()
    const account = useSelector((state) => state.user.account);

    return (
        <div className="dashboard-employer" onClick={()=>navigate("profile-employer")}>
            <Card>
                <div className="logo">
                    <UserOutlined />
                </div>
                <div className="information">
                    <div className="username">{account.username}</div>
                    <div className="email">{account.email}</div>
                </div>
            </Card>

            <div className="de-row">
                
            </div>
        </div>
    );
};

export default DashBoardEmployer;

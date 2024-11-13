import React from "react";
import EmployerHeader from "../../layouts/Header/EmployerHeader";
import "./HomeEmployer.scss";
import { CheckOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

const HomeEmployerPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <EmployerHeader />
            <div className="home-employer-container">
                <div className="hec-content">
                    <div className="hec-title">
                        Post job ads,
                        <p> Find candidates effectively</p>
                    </div>
                    <div className="hec-meta">
                        <ul>
                            <li>
                                <CheckOutlined />
                                Posting job ads is free, simple and fast
                            </li>
                            <li>
                                <CheckOutlined />A huge source of candidates
                                from many different industries and fields
                            </li>
                            <li>
                                <CheckOutlined />
                                Posting job ads is free, simple and fast
                            </li>
                        </ul>
                    </div>
                    <button
                        className="hec-button"
                        onClick={() => {
                            navigate("/register-employer");
                        }}
                    >
                        Post job ads for free
                    </button>
                </div>
            </div>
        </>
    );
};

export default HomeEmployerPage;

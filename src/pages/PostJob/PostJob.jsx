import React from "react";
import { useSelector } from "react-redux";
import SideBar from "../../layouts/SideBar/SideBar";
import { Outlet } from "react-router-dom";
import "./PostJob.scss";

const PostJob = () => {
    const account = useSelector((state) => state.user.account);

    if (account.role === "user" || account.role === "admin") {
        return <div>You're not allowed to access this page</div>;
    }

    return (
        <main id="employer">
            <SideBar />
            <Outlet />
        </main>
    );
};

export default PostJob;

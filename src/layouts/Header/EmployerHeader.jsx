import React, { useState } from "react";
import {
  LoginOutlined,
  LogoutOutlined,
  HomeOutlined,
  UserAddOutlined,
  UserOutlined,
  FileAddOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  ContainerOutlined,
  ApartmentOutlined,
  ToolOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./EmployerHeader.scss"; // Import the CSS file for styling

const logo = `/images/JobLink.png`;

const EmployerHeader = () => {
  const [current, setCurrent] = useState("home");

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const itemsLeft = [
    {
      label: <Link to="/">
        <img src={logo} alt="JobLink" style={{height: '30px'}}/>
      </Link>,
      key: "home",
      // icon: <HomeOutlined />,
    },
    {
      label: <Link to="/">Recruitments</Link>,
      // key: "recruitments",
      icon: <SolutionOutlined />,
    },
    {
      label: <Link to="/">Profile & CV</Link>,
      key: "profile&cv",
      icon: <ContainerOutlined />,
    },
    {
      label: <Link to="/">Companies</Link>,
      key: "companies",
      icon: <ApartmentOutlined />,
    },
    {
      label: <Link to="/">Tools</Link>,
      key: "tools",
      icon: <ToolOutlined />,
    },
    {
      label: <Link to="/">Resources</Link>,
      key: "resources",
      icon: <FileTextOutlined />,
    },
  ];

  const itemsRight = [
    {
      label: <Link to="/login-user">Sign In</Link>,
      key: "login",
      icon: <LoginOutlined />,
    },
    {
      label: <Link to="/register-employer">Sign Up</Link>,
      key: "signup",
      icon: <UserAddOutlined />,
    },
  ];

  return (
    <div className="header-container">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={itemsLeft}
        className="menu-left"
      />
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={itemsRight}
        className="menu-right"
      />
    </div>
  );
};

export default EmployerHeader;

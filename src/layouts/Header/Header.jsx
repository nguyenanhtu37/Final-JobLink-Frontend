import React, { useEffect, useState } from "react";
import {
    LoginOutlined,
    LogoutOutlined,
    HomeOutlined,
    UserAddOutlined,
    UserOutlined,
    FileAddOutlined,
    SettingOutlined,
    SolutionOutlined,
    ContainerOutlined,
    ApartmentOutlined,
    ToolOutlined,
    FileTextOutlined,
    UnorderedListOutlined,
    FileDoneOutlined,
    ContactsOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { Menu, Badge } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doLogout } from "../../redux/action/userAction";
import { getNoficationByUser, updateNotificationStatus } from "../../Api/api";
import "./Header.scss";
import NotificationModal from "../../components/Modal/NoficationModal";

const Header = () => {
    const [current, setCurrent] = useState("home");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [dataNotification, setDataNotification] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

    const logo = `/images/JobLink.png`;

    const onClick = (e) => {
        console.log("click ", e);
        setCurrent(e.key);
    };

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const account = useSelector((state) => state.user.account);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(doLogout());
        navigate("/");
    };

    useEffect(() => {
        fetchNotification();
    }, []); // Fetch notifications when user ID changes

    const fetchNotification = async () => {
        try {
            const res = await getNoficationByUser(account.id);
            // Ensure notifications are an array
            setDataNotification(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    console.log(dataNotification);

    const handleNotificationClick = async () => {
        setIsModalVisible(true);
        // Update notification status to read
        await updateNotificationStatus(account.id); // Ensure this is implemented in your API
        fetchNotification(); // Fetch notifications again to reflect changes
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const unreadCount = Array.isArray(dataNotification)
        ? dataNotification.filter((notification) => !notification.isRead).length
        : 0; // Count unread notifications

  const itemsLeft = [
    {
      label: <Link to="/"><img src={logo} alt="JobLink" style={{ height: '30px' }} /></Link>,
      key: "home",
    },
    {
      label: <Link to="/recruitments">Recruitments</Link>,
      icon: <SolutionOutlined />,
      key: "recruitments",
    },
    isAuthenticated
      ? {
        label: <Link to="/cv_profile">Profile & CV</Link>,
        key: "profile&cv",
        icon: <ContainerOutlined />,
      }
      : {
        label: <Link to="/login-user">Profile & CV</Link>,
        key: "login-user",
        icon: <ContainerOutlined />,
      },
    isAuthenticated
      ? {
        label: <Link to='/manage_cv'>Manage CV</Link>,
        key: 'managecv',
        icon: <SnippetsOutlined />
      }
      : {
        label: <Link to="/login-user">Manage CV</Link>,
        key: "login-user",
        icon: <SnippetsOutlined />,
      },
    {
      label: <Link to="/companies">Companies</Link>,
      key: "companies",
      icon: <ApartmentOutlined />,
    },
    {
      label: <Link to='interview'>Interview</Link>,
      key: 'interview',
      icon: <ContactsOutlined />,
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
        ...(isAuthenticated === false
            ? [
                {
                    label: <Link to="/login-user">Sign In</Link>,
                    key: "signin",
                    icon: <LoginOutlined />,
                },
                {
                    label: <Link to="/register-user">Sign Up</Link>,
                    key: "signup",
                    icon: <UserAddOutlined />,
                },
                {
                    label: (
                          <Link to="/recruitment-consulting">
                              Recruitment Consulting
                          </Link>
                      ),
                    key: "recruitment-consulting",
                    icon: <FileAddOutlined />,
                },
                {
                    label: <Link to="/login-employer">Employer</Link>,
                    key: "login-employer",
                    icon: <FileAddOutlined />,
                },
            ]
            : [
                {
                    label: <span>Setting</span>,
                    key: "setting",
                    icon: <SettingOutlined />,
                    children: [
                        {
                            label: (
                                  <span onClick={handleLogout}>Log Out</span>
                              ),
                            key: "logout",
                            icon: <LogoutOutlined />,
                        },
                        {
                            label: (
                                <Link to={`/applied-recruitments`}>
                                      Đơn đã ứng tuyển
                                  </Link>
                            ),
                            key: "applied-recruitments",
                            icon: <FileDoneOutlined />,
                        },
                        {
                            label: (
                                <Link to={`/favorite`}>
                                      Tin tuyển dụng yêu thích
                                  </Link>
                            ),
                            key: "favorite",
                            icon: <UnorderedListOutlined />,
                        },
                        {
                            label: (
                                <Link to={`/profile/${account.id}`}>
                                    Welcome {account.username}
                                </Link>
                            ),
                            key: "account",
                            icon: <UserOutlined />,
                          },
                          {
                            label: (
                                <Link to={`/reset-password-user`}>
                                    Change Password
                                </Link>
                            ),
                            key: "reset-password-user",
                            icon: <FileDoneOutlined />,
                      },
                    ],
                },
                {
                    label: (
                        <span onClick={handleNotificationClick}>
                            <Badge count={unreadCount} overflowCount={99}>
                                Notification
                            </Badge>
                        </span>
                    ),
                    key: "notification",
                },
            ]),
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
            <NotificationModal
                open={isModalVisible}
                onClose={closeModal}
                notifications={dataNotification}
            />
        </div>
    );
};

export default Header;

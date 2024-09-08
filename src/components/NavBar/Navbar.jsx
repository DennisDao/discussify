import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Row, Col, Menu, Badge } from "antd";
import useAuthService from "../../service/authService.jsx";
import useApiService from "../../service/apiService.jsx";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Input,
  Tooltip,
  Typography,
  Button,
  Flex,
  List,
  Popover,
} from "antd";
import {
  ClockCircleOutlined,
  SearchOutlined,
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  MessageOutlined,
  BellOutlined,
} from "@ant-design/icons";

const Navigation = () => {
  const { logout, getUserName, getAvatar, getUserId } = useAuthService();
  const navigate = useNavigate();
  const apiService = useApiService();
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const notifications = await apiService.get(
      `http://localhost:6819/api/Notification?userId=${getUserId()}`
    );
    setNotifications(notifications);
  };

  const notificationForMap = () => {
    const handleNotificationClick = async (notification) => {
      switch (notification.notificationType) {
        case "Post":
          await apiService.post(
            `http://localhost:6819/api/Notification/SetViewed?notificationId=${notification.notificationId}`
          );
          navigate(`/Post/${notification.entityId}`);
          break;
        default:
          break;
      }
    };

    return (
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(notification, index) => (
          <List.Item
            onClick={() => handleNotificationClick(notification)}
            key={index}
          >
            <List.Item.Meta title={notification.message} />
          </List.Item>
        )}
      />
    );
  };

  const items = [
    {
      icon: (
        <Button
          shape="square"
          size="large"
          type="text"
          className="nav-bar-button navbar-avatar-button nav-bar-profile-items"
        >
          <Avatar src={getAvatar()} style={{ marginRight: "1rem" }} size={45} />
          <span>{getUserName()}</span>
        </Button>
      ),
      children: [
        {
          key: "Light_Theme",
          label: "Switch to Light Theme",
        },
        {
          key: "Dark_Theme",
          label: "Switch to Dark Theme",
        },
        {
          key: "PROFILE",
          label: "Profile",
        },
        {
          key: "LOGOUT",
          label: "Logout",
        },
      ],
    },
  ];

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/QuickSearch?query=${query}`);
    }
  };

  const handleMenuItemClick = async (item) => {
    switch (item.key) {
      case "LOGOUT":
        logout();
        break;
      case "Light_Theme":
        document.querySelector("body").setAttribute("data-theme", "light");
        break;
      case "Dark_Theme":
        document.querySelector("body").setAttribute("data-theme", "dark");
        break;
      case "PROFILE":
        navigate("/Profile");
        break;
    }
  };

  return (
    <>
      <Row id="app-navbar" className="nav-bar">
        <Col span={8} className="nav-bar-menu-left">
          <Flex gap="middle" align="start" justify="space-between">
            <Typography.Title
              level={3}
              style={{
                color: "#FF571A",
                marginBottom: "0px",
                fontWeight: "bold",
              }}
            >
              DISCUSSIFY
            </Typography.Title>

            <Flex align="center">
              <Button
                shape="square"
                size="large"
                type="text"
                className="nav-bar-button"
                onClick={() => navigate("/")}
              >
                <HomeOutlined />
              </Button>
              <Button
                shape="square"
                size="large"
                type="text"
                className="nav-bar-button"
              >
                <CalendarOutlined />
              </Button>
              <Button
                shape="square"
                size="large"
                type="text"
                className="nav-bar-button"
                onClick={() => navigate("/Author")}
              >
                <UserOutlined />
              </Button>
              <Button
                shape="square"
                size="large"
                type="text"
                className="nav-bar-button"
              >
                <ClockCircleOutlined />
              </Button>
            </Flex>
          </Flex>
        </Col>

        <Col span={8}>
          <Input
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            size="large"
            placeholder="Type here to search..."
            suffix={
              <Tooltip
                title="Search"
                onClick={() => navigate(`/QuickSearch?query=${query}`)}
              >
                <SearchOutlined />
              </Tooltip>
            }
            className="discussify-input"
            variant="borderless"
          />
        </Col>

        <Col span={8}>
          <Flex align="center" justify="flex-end">
            <Button
              shape="square"
              size="large"
              type="text"
              className="nav-bar-button"
              style={{ fontSize: "1.5rem" }}
            >
              <MessageOutlined />
            </Button>

            <Popover title="Notification" content={notificationForMap()}>
              <Badge
                count={notifications.length}
                style={{ top: "5px", right: "20px" }}
              >
                <Button
                  shape="square"
                  size="large"
                  type="text"
                  className="nav-bar-button"
                  style={{ fontSize: "1.5rem" }}
                >
                  <BellOutlined />
                </Button>
              </Badge>
            </Popover>

            <Menu
              style={{ lineHeight: "0px" }}
              mode="horizontal"
              items={items}
              onClick={handleMenuItemClick}
            />
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default Navigation;

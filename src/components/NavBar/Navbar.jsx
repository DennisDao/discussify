import React from "react";
import "./Navbar.css";
import { Row, Col, Menu } from "antd";
import useAuthService from "../../service/authService.jsx";
import { Avatar, Input, Tooltip, Typography, Button, Flex, Image } from "antd";
import {
  ClockCircleOutlined,
  SearchOutlined,
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  MessageOutlined,
  BellOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const Navigation = () => {
  const { logout, getUserName, getAvatar } = useAuthService();

  const items = [
    {
      icon: (
        <Button
          shape="square"
          size="large"
          type="text"
          className="nav-bar-button navbar-avatar-button"
          style={{ fontSize: "1rem", color: "#FFFFFF" }}
        >
          <Avatar src={getAvatar()} style={{ marginRight: "1rem" }} size={45} />
          <span>{getUserName()}</span>
        </Button>
      ),
      children: [
        {
          key: "LOGOUT",
          label: "Logout",
        },
      ],
    },
  ];

  const handleMenuItemClick = async (item) => {
    switch (item.key) {
      case "LOGOUT":
        logout();
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
                style={{ fontSize: "1.5rem" }}
              >
                <HomeOutlined />
              </Button>
              <Button
                shape="square"
                size="large"
                type="text"
                className="nav-bar-button"
                style={{ fontSize: "1.5rem" }}
              >
                <CalendarOutlined />
              </Button>
              <Button
                shape="square"
                size="large"
                type="text"
                className="nav-bar-button"
                style={{ fontSize: "1.5rem" }}
              >
                <UserOutlined />
              </Button>
              <Button
                shape="square"
                size="large"
                type="text"
                className="nav-bar-button"
                style={{ fontSize: "1.5rem" }}
              >
                <ClockCircleOutlined />
              </Button>
            </Flex>
          </Flex>
        </Col>

        <Col span={8}>
          <Input
            size="large"
            placeholder="Type here to search..."
            suffix={
              <Tooltip title="Search">
                <SearchOutlined style={{ color: "white" }} />
              </Tooltip>
            }
            className={"input-dark"}
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
            <Button
              shape="square"
              size="large"
              type="text"
              className="nav-bar-button"
              style={{ fontSize: "1.5rem" }}
            >
              <BellOutlined />
            </Button>

            <Menu
              style={{
                background: "#262D34",
                lineHeight: "0px",
              }}
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

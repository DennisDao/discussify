import React, { useState } from "react";
import { Typography, Button, Flex, Input } from "antd";
import useAuthService from "../../service/authService.jsx";

const Login = () => {
  const { login } = useAuthService();

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(username, password);
  };

  return (
    <>
      <Flex
        align="center"
        justify="center"
        vertical={true}
        style={{ height: "80vh" }}
      >
        <Typography.Title
          level={3}
          style={{
            color: "#FF571A",
            marginBottom: "0px",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          DISCUSSIFY
        </Typography.Title>

        <Input
          onChange={(e) => setUsername(e.target.value)}
          size="large"
          placeholder="Email address"
          className={"input-dark"}
          variant="borderless"
          style={{ marginBottom: "15px", width: "400px" }}
        />

        <Input.Password
          onChange={(e) => setPassword(e.target.value)}
          size="large"
          variant="borderless"
          className={"input-dark"}
          placeholder="input password"
          style={{ marginBottom: "15px", width: "400px" }}
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
        />

        <Button type="link" className="orange-btn" onClick={handleLogin}>
          Login
        </Button>
      </Flex>
    </>
  );
};

export default Login;

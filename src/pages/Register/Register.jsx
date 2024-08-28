import React, { useState } from "react";
import { Typography, Button, Flex, Input, Upload, message, Avatar } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import useAuthService from "../../service/authService.jsx";
import useApiService from "../../service/apiService";
import "./Register.css";

const Register = () => {
  const { register, login } = useAuthService();
  const apiService = useApiService();

  const [isUploading, setIsUploading] = useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLasName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const handleRegister = async () => {
    var response = await register(email, firstName, lastName, password);
    await uploadAvatar(response.userId);
    await login(email, password);
  };

  const uploadButton = (
    <button className="upload-button" type="button">
      {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Avatar</div>
    </button>
  );

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadAvatar = async (userId) => {
    const formData = new FormData();
    formData.append("image", image.file.originFileObj);

    var response = await apiService.postFormData(
      `http://localhost:6819/api/Accounts/avatar?userId=${userId}`,
      formData
    );
  };

  const handleUploadChange = async (info) => {
    getBase64(info.file.originFileObj, (url) => {
      setIsUploading(false);
      setImageUrl(url);
      setImage(info);
    });
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

        <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleUploadChange}
        >
          {imageUrl ? <Avatar src={imageUrl} /> : uploadButton}
        </Upload>

        <Input
          onChange={(e) => setEmail(e.target.value)}
          size="large"
          placeholder="Email"
          className={"input-dark"}
          variant="borderless"
          style={{ marginBottom: "15px", width: "400px", marginTop: "30px" }}
        />

        <Input
          onChange={(e) => setFirstName(e.target.value)}
          size="large"
          placeholder="First name"
          className={"input-dark"}
          variant="borderless"
          style={{ marginBottom: "15px", width: "400px" }}
        />

        <Input
          onChange={(e) => setLasName(e.target.value)}
          size="large"
          placeholder="Last name"
          className={"input-dark"}
          variant="borderless"
          style={{ marginBottom: "15px", width: "400px" }}
        />

        <Input.Password
          onChange={(e) => setPassword(e.target.value)}
          size="large"
          variant="borderless"
          className={"input-dark"}
          placeholder="Password"
          style={{ marginBottom: "15px", width: "400px" }}
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
        />

        <Button type="link" className="orange-btn" onClick={handleRegister}>
          Register
        </Button>
      </Flex>
    </>
  );
};

export default Register;

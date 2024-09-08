import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Skeleton,
  Typography,
  Row,
  Col,
  Card,
  Input,
  Upload,
} from "antd";
import useAuthService from "../../service/authService";
import useApiService from "../../service/apiService";
import Navigation from "../../components/NavBar/Navbar";
import "./Profile.css";

const { TextArea } = Input;

const Profile = () => {
  const apiService = useApiService();
  const { getAvatar, getUserId } = useAuthService();
  const [editEnabled, setEditEnabled] = useState(true);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });
  const [inputValues, setInputValues] = useState(userDetails);
  const [imageUrl, setImageUrl] = useState();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userId = getUserId();
    const userDetail = await apiService.get(
      `http://localhost:6819/api/Accounts/UserDetails?userId=${userId}`
    );
    setUserDetails(userDetail);
    setInputValues(userDetail);
  };

  const handleEditToggle = () => {
    setEditEnabled((prev) => !prev);
    setInputValues(userDetails);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const updatedDetails = {
      UserId: getUserId(),
      ...inputValues,
    };

    await apiService.post(
      `http://localhost:6819/api/Accounts/UpdateUserDetail/`,
      updatedDetails
    );

    setUserDetails(inputValues);
    setEditEnabled(true);
  };

  const handleUploadChange = (info) => {
    getBase64(info.file.originFileObj, (url) => {
      uploadAvatar(getUserId(), info.file.originFileObj);
      setImageUrl(url);
    });
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const uploadAvatar = async (userId, file) => {
    if (isUploading) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    var response = await apiService.postFormData(
      `http://localhost:6819/api/Accounts/avatar?userId=${userId}`,
      formData
    );

    setIsUploading(false);
  };

  const upload = (
    <Upload
      name="avatar"
      showUploadList={false}
      className="avatar-container"
      onChange={handleUploadChange}
    >
      {!isUploading ? (
        <img
          alt="profile-image"
          id="profile-image"
          src={imageUrl || getAvatar()}
        />
      ) : (
        <span>Uploading...</span>
      )}
    </Upload>
  );

  return (
    <>
      <Navigation />
      <Row style={{ padding: "8px" }}>
        <Col span={8}>
          <Card style={{ width: 300 }} cover={upload}>
            <TextArea
              name="bio"
              size="large"
              placeholder="Bio"
              className="discussify-input"
              style={{ marginBottom: "15px" }}
              value={inputValues.bio}
              disabled={editEnabled}
              onChange={handleInputChange}
              autoSize={{ minRows: 4, maxRows: 10 }}
            />
            <Input
              name="firstName"
              size="large"
              placeholder="First name"
              className="discussify-input"
              style={{ marginBottom: "15px" }}
              value={inputValues.firstName}
              disabled={editEnabled}
              onChange={handleInputChange}
            />
            <Input
              name="lastName"
              size="large"
              placeholder="Last name"
              className="discussify-input"
              style={{ marginBottom: "15px" }}
              value={inputValues.lastName}
              disabled={editEnabled}
              onChange={handleInputChange}
            />
            <Input
              name="email"
              size="large"
              placeholder="Email"
              className="discussify-input"
              style={{ marginBottom: "15px" }}
              value={inputValues.email}
              disabled={editEnabled}
              onChange={handleInputChange}
            />
            <Button className="orange-btn" onClick={handleEditToggle}>
              {editEnabled ? "Edit" : "Cancel"}
            </Button>
            {!editEnabled && (
              <Button className="orange-btn" onClick={handleSave}>
                Save
              </Button>
            )}
          </Card>
        </Col>
        <Col span={14} />
      </Row>
    </>
  );
};

export default Profile;

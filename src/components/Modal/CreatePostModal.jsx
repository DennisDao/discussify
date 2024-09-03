import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Flex, Input, Tag, Modal, Select, message, Upload, theme } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import useApiService from "../../service/apiService";
import useAuthService from "../../service/authService";
import "./CreatePostModal.css";

const tagInputStyle = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: "top",
};

const CreatePostModal = forwardRef((props, ref) => {
  const { getUserId } = useAuthService();
  const apiService = useApiService();
  const { token } = theme.useToken();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inputTagVisible, setTagInputVisible] = useState(false);
  const [tagInputValue, setTagInputValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useImperativeHandle(ref, () => ({
    launchModal() {
      setIsModalOpen(true);
    },
  }));

  const fetchData = async () => {
    const categories = await apiService.get(
      "http://localhost:6819/api/Category"
    );

    const options = [];

    for (let i = 0; i < categories.length; i++) {
      options.push({
        value: categories[i].id,
        label: categories[i].categoryName,
      });
    }

    setCategories(options);
  };

  const tagForMap = (tag) => (
    <span
      key={tag}
      style={{
        display: "inline-block",
      }}
    >
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          removeTag(tag);
        }}
      >
        {tag}
      </Tag>
    </span>
  );

  const tagChild = tags.map(tagForMap);

  const removeTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const tagPlusStyle = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleChange = () => {
    setIsModalOpen(false);
  };

  const showTagInput = () => {
    setTagInputVisible(true);
  };

  const handleTagInputChange = (e) => {
    setTagInputValue(e.target.value);
  };

  const handleTagInputConfirm = () => {
    if (tagInputValue && tags.indexOf(tagInputValue) === -1) {
      setTags([...tags, tagInputValue]);
    }
    setTagInputVisible(false);
    setTagInputValue("");
  };

  const handleCreatePost = async () => {
    var data = {
      userId: getUserId(),
      title: title,
      description: description,
      categoryId: selectedCategory,
      tags: tags,
    };

    const response = await apiService.post(
      "http://localhost:6819/api/Post",
      data
    );

    if (response.postId != null && image != null) {
      await uploadPostImage(response.postId);
    }

    setIsModalOpen(false);
  };

  const uploadButton = (
    <button className="upload-button" type="button">
      {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
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

  const handleUploadChange = async (info) => {
    getBase64(info.file.originFileObj, (url) => {
      setImageUrl(url);
      setImage(info);
    });
  };

  const uploadPostImage = async (postId) => {
    if (isUploading) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", image.file.originFileObj);
    var response = await apiService.postFormData(
      `http://localhost:6819/api/Post/UploadImage?postId=${postId}`,
      formData
    );

    setIsUploading(false);
  };

  return (
    <>
      <Modal
        className="create-post-modal"
        width={1020}
        title="Create Post"
        open={isModalOpen}
        onOk={handleCreatePost}
        onCancel={handleCancel}
      >
        <Input
          size="large"
          placeholder="Title"
          className="discussify-input"
          variant="borderless"
          style={{ marginBottom: "15px" }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          size="large"
          placeholder="Description"
          className="discussify-input"
          variant="borderless"
          style={{ marginBottom: "15px" }}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Select
          size="large"
          defaultValue="Select Category"
          onChange={handleCategoryChange}
          style={{
            width: 200,
          }}
          options={categories}
        />

        <Flex style={{ marginTop: "15px" }}>
          {tagChild}
          {inputTagVisible ? (
            <Input
              ref={inputRef}
              type="text"
              className="discussify-input"
              size="small"
              style={{
                width: 78,
              }}
              value={tagInputValue}
              onChange={handleTagInputChange}
              onBlur={handleTagInputConfirm}
              onPressEnter={handleTagInputConfirm}
            />
          ) : (
            <Tag onClick={showTagInput} style={tagPlusStyle}>
              <PlusOutlined /> New Tag
            </Tag>
          )}
        </Flex>

        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleUploadChange}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </Modal>
    </>
  );
});

export default CreatePostModal;

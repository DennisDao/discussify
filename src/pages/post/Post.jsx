import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Avatar,
  Flex,
  FloatButton,
  Switch,
} from "antd";
import { CommentOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import TextEditor from "../../components/TextEditor/TextEdidtor.jsx";
import useApiService from "../../service/apiService";
import useAuthService from "../../service/authService";
import Navigation from "../../components/NavBar/Navbar.jsx";
import "./post.css";
import zIndex from "@mui/material/styles/zIndex.js";

const { Text, Link, Title } = Typography;

const usercomment = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const Post = () => {
  const { id } = useParams();
  const apiService = useApiService();
  const { getUserId, getAvatar, getUserName } = useAuthService();
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const post = await apiService.get(`http://localhost:6819/api/Post/${id}`);
    var data = post.comments;

    const comments = data.map((item) => {
      console.log(item);
      return {
        comment: JSON.parse(item.content),
        authorImage: item.authorImageUrl,
        whenCreated: item.whenCreated,
        authorName: item.authorName,
      };
    });

    console.log(comments);
    setComments(comments);
  };

  const addComment = async (comment) => {
    var data = {
      userId: getUserId(),
      postId: id,
      comment: JSON.stringify(comment),
    };

    const response = await apiService.post(
      "http://localhost:6819/api/Post/Comment",
      data
    );

    var newComment = {
      comment: comment,
      authorImage: getAvatar(),
      whenCreated: "Now",
      authorName: getUserName(),
    };

    setComments([...comments, newComment]);
  };

  return (
    <>
      <Navigation></Navigation>

      <div className="container">
        <Row className="comment-container">
          <Col span={6} />
          <Col span={12} id="comment-container">
            {comments.map((comment, index) => (
              <Card style={{ marginTop: 16 }}>
                <Row style={{ marginBottom: "10px" }}>
                  <Flex
                    justify="space-between"
                    align="flex-start"
                    style={{ width: "100%" }}
                  >
                    <Flex>
                      <Avatar
                        size={{
                          xs: 24,
                          sm: 32,
                          md: 40,
                          lg: 45,
                          xl: 50,
                          xxl: 55,
                        }}
                        src={comment.authorImage}
                        style={{ marginRight: "20px" }}
                      />
                      <Text style={{ color: "#858EAD" }}>
                        {comment.authorName}
                      </Text>
                    </Flex>

                    <Text style={{ color: "#858EAD" }}>
                      {comment.whenCreated}
                    </Text>
                  </Flex>
                </Row>

                <TextEditor
                  editorType={1}
                  isReadOnly={true}
                  showToolBar={false}
                  comment={comment.comment}
                ></TextEditor>
              </Card>
            ))}
          </Col>
          <Col span={6} />
        </Row>

        <div class="overlay-element"></div>

        <Row id="comment-control" style={{ zIndex: 100, position: "relative" }}>
          <Col span={6} />
          <Col span={12}>
            <Card style={{ marginTop: 25 }} id="text-editor-container">
              <TextEditor
                editorType={2}
                isReadOnly={false}
                showToolBar={true}
                comment={usercomment}
                onCommentAdded={addComment}
              ></TextEditor>
            </Card>
          </Col>
          <Col span={6} />
        </Row>
      </div>

      <FloatButton.Group>
        <FloatButton.BackTop visibilityHeight={0} />
      </FloatButton.Group>
    </>
  );
};

export default Post;

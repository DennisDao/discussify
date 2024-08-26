import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Card, Typography, Avatar, Flex } from "antd";
import TextEditor from "../../components/TextEditor/TextEdidtor.jsx";
import useApiService from "../../service/apiService";
import useAuthService from "../../service/authService";
import Navigation from "../../components/NavBar/Navbar.jsx";
import "./post.css";

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
  const { getUserId, getAvatar } = useAuthService();
  const [comments, setComments] = useState([]);

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
    };

    setComments([...comments, newComment]);
  };

  return (
    <>
      <Navigation></Navigation>
      <Row>
        <Col span={6} />
        <Col span={12} id="comment-container">
          {comments.map((comment, index) => (
            <Card style={{ marginTop: 16 }}>
              <Row>
                <Flex
                  justify="space-between"
                  align="flex-start"
                  style={{ width: "100%" }}
                >
                  <Avatar
                    size={{ xs: 24, sm: 32, md: 40, lg: 45, xl: 50, xxl: 55 }}
                    src={comment.authorImage}
                    style={{ marginRight: "20px" }}
                  />

                  <Text style={{ color: "#858EAD" }}>
                    {comment.whenCreated}
                  </Text>
                </Flex>
              </Row>

              <TextEditor
                isReadOnly={true}
                showToolBar={false}
                comment={comment.comment}
              ></TextEditor>
            </Card>
          ))}
        </Col>
        <Col span={6} />
      </Row>

      <Row id="comment-control">
        <Col span={6} />
        <Col span={12}>
          <Card style={{ marginTop: 16 }} id="text-editor-container">
            <TextEditor
              isReadOnly={false}
              showToolBar={true}
              comment={usercomment}
              onCommentAdded={addComment}
            ></TextEditor>
          </Card>
        </Col>
        <Col span={6} />
      </Row>
    </>
  );
};

export default Post;

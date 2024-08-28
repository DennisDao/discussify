import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Avatar,
  Flex,
  Input,
  Button,
  Image,
  Tag,
} from "antd";
import {
  OrderedListOutlined,
  CommentOutlined,
  UserOutlined,
  HeartFilled,
} from "@ant-design/icons";
import Topic from "../../components/Topic/Topic.jsx";
import Navigation from "../../components/NavBar/Navbar.jsx";
import "../../App.css";
import useApiService from "../../service/apiService.jsx";
import useAuthService from "../../service/authService.jsx";
import CreatePostModal from "../../components/Modal/CreatePostModal.jsx";
import CategoriesCard from "../../components/Topic/CategoriesCard.jsx";

const { Text, Link, Title } = Typography;

const Home = () => {
  const [post, setPost] = useState([]);
  const apiService = useApiService();
  const { getAvatar } = useAuthService();
  const childRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => childRef.current.launchModal();

  const fetchData = async () => {
    const latestPost = await apiService.get("http://localhost:6819/api/Post");
    setPost(latestPost);
  };

  return (
    <>
      <Navigation></Navigation>
      <Row className="side-feed">
        <Col span={5} style={{ paddingRight: "15px" }}>
          <Card style={{ marginTop: 16 }}>
            <Topic
              title="Newest and Recent"
              description="Find the latest update"
              component={<CommentOutlined style={{ color: "yellow" }} />}
            />
            <Topic
              title="Popular of the day"
              description="popular threads for the day"
              component={<OrderedListOutlined style={{ color: "#EEA956" }} />}
            />
            <Topic
              title="Following"
              description="Explore from your favourite person"
              component={<UserOutlined style={{ color: "#FF6934" }} />}
            />
          </Card>

          <CategoriesCard></CategoriesCard>
        </Col>

        <Col span={19}>
          <Card style={{ marginTop: 16 }} key="create-post-control">
            <Row>
              <Col>
                <Avatar size={50} src={getAvatar()} />
              </Col>

              <Col span={20}>
                <Input
                  size="large"
                  placeholder="Type here to share what's going on in your mind..."
                  className={"input-dark"}
                  variant="borderless"
                  style={{ marginLeft: 16 }}
                />
              </Col>

              <Col>
                <Button
                  type="link"
                  style={{ marginLeft: 16 }}
                  className="orange-btn"
                  onClick={openModal}
                >
                  Create Post
                </Button>
              </Col>
            </Row>
          </Card>

          {post.map((p, key) => {
            return (
              <>
                <Card style={{ marginTop: 10 }} key={key}>
                  <Flex style={{ width: "100%" }}>
                    <Image
                      src={p.imageUrl}
                      width={300}
                      height={200}
                      style={{ borderRadius: 20 }}
                    />

                    <div style={{ marginLeft: 16, width: "100%" }}>
                      <Flex justify="space-between" align="center">
                        <Link
                          href={`/Post/${p.postId}`}
                          style={{
                            color: "white",
                            marginBottom: "5px",
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          {p.title}
                        </Link>
                        <Button type="text" className="favourite-btn">
                          <HeartFilled />
                        </Button>
                      </Flex>

                      <Text style={{ color: "#858EAD" }}>{p.description}</Text>

                      <Flex
                        gap="0px 0px"
                        wrap="wrap"
                        style={{ marginTop: "5px" }}
                      >
                        {p.tags.map((tag, key) => (
                          <Tag key={key} color="#262D34">
                            {tag}
                          </Tag>
                        ))}
                      </Flex>

                      <Flex
                        style={{ marginTop: "25px", height: "50px" }}
                        gap="0px 100px"
                        justify="space-between"
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
                            src={p.authorImageUrl}
                            style={{ marginRight: "20px" }}
                          />
                          <Flex vertical={true} gap="5px 3px">
                            <Text
                              type="secondary"
                              style={{ color: "white", fontWeight: "bold" }}
                            >
                              {p.authorName} {p.authorLastName}
                            </Text>
                            <Text type="secondary" style={{ color: "#858EAD" }}>
                              {p.whenCreated}
                            </Text>
                          </Flex>
                        </Flex>

                        <Flex gap="0px 30px" align="center">
                          <Text type="secondary" style={{ color: "#858EAD" }}>
                            {p.totalViews} Views
                          </Text>
                          <Text type="secondary" style={{ color: "#858EAD" }}>
                            {p.totalLikes} Likes
                          </Text>
                          <Text type="secondary" style={{ color: "#858EAD" }}>
                            {p.totalComments} Comments
                          </Text>
                        </Flex>
                      </Flex>
                    </div>
                  </Flex>
                </Card>
                ;
              </>
            );
          })}
        </Col>
      </Row>

      <CreatePostModal ref={childRef}></CreatePostModal>
    </>
  );
};

export default Home;

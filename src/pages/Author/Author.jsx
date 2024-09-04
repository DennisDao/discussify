import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  List,
  Skeleton,
  Typography,
  Row,
  Col,
  Card,
  Input,
  Tooltip,
  Image,
  Flex,
  Space,
} from "antd";
import {
  SearchOutlined,
  StarOutlined,
  LikeOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import Navigation from "../../components/NavBar/Navbar.jsx";
import useApiService from "../../service/apiService.jsx";

const { Text, Link, Title } = Typography;
const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const Author = () => {
  const apiService = useApiService();
  const navigate = useNavigate();
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [post, setPost] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const authors = await apiService.get(
      `http://localhost:6819/api/Author?pageSize=${1}&pageNumber=${pageNumber}`
    );

    setInitLoading(false);
    setData(authors);
    setList(authors);
  };

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      setLoading(true);

      const authors = await apiService.get(
        `http://localhost:6819/api/Author/FindAuthor?query=${query}`
      );

      console.log(authors);

      setInitLoading(false);
      setData(authors);
      setList(authors);
    }
  };

  const handleAuthorClick = async (id) => {
    debugger;
    const post = await apiService.get(
      `http://localhost:6819/api/Post/User/${id}`
    );
    setPost(post);
  };

  const onLoadMore = async () => {
    setLoading(true);
    let newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);

    setList(
      data.concat(
        [...new Array(count)].map(() => ({
          loading: true,
          name: {},
          picture: {},
        }))
      )
    );

    const authors = await apiService.get(
      `http://localhost:6819/api/Author?pageSize=${1}&pageNumber=${newPageNumber}`
    );

    const newData = data.concat(authors);
    console.log(newData);

    setData(newData);
    setList(newData);
    setLoading(false);
    window.dispatchEvent(new Event("resize"));
  };
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  return (
    <>
      <Navigation></Navigation>
      <Row style={{ padding: "8px" }}>
        <Col span={8} style={{ padding: "5px" }}>
          <Card>
            <Input
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              size="large"
              placeholder="Type here to search author..."
              suffix={
                <Tooltip title="Search">
                  <SearchOutlined />
                </Tooltip>
              }
              className="discussify-input"
              variant="borderless"
            />
            <List
              className="demo-loadmore-list"
              loading={initLoading}
              itemLayout="horizontal"
              loadMore={loadMore}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <IconText
                      icon={UserAddOutlined}
                      text="Follow"
                      key="list-vertical-star-o"
                    />,
                    <IconText
                      icon={StarOutlined}
                      text="12 followers"
                      key="list-vertical-like-o"
                    />,
                  ]}
                >
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      avatar={<Avatar src={item.picture} />}
                      title={
                        <a onClick={() => handleAuthorClick(item.userId)}>
                          {item.firstName} {item.lastName}
                        </a>
                      }
                      description="Just another software developer."
                    />
                  </Skeleton>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={16} style={{ padding: "5px" }}>
          <Card>
            <List
              className="demo-loadmore-list"
              loading={initLoading}
              itemLayout="horizontal"
              dataSource={post}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a key="list-loadmore-edit">View</a>,
                    <a key="list-loadmore-more">more</a>,
                  ]}
                >
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      avatar={
                        <Avatar src={item.imageUrl} shape="square" size={64} />
                      }
                      title={
                        <a onClick={() => navigate(`/Post/${item.postId}`)}>
                          {item.title}
                        </a>
                      }
                      description={item.description}
                    />
                  </Skeleton>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Author;

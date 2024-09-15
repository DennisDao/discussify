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
  Space,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  StarOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import Navigation from "../../components/NavBar/Navbar.jsx";
import useApiService from "../../service/apiService.jsx";
import useAuthService from "../../service/authService.jsx";

const { Text } = Typography;

const Author = () => {
  const apiService = useApiService();
  const navigate = useNavigate();
  const { getUserId } = useAuthService();

  const [authors, setAuthors] = useState({
    items: [],
    loading: true,
    pageNumber: 1,
  });

  const [followingAuthor, setFollowingAuthor] = useState(null);

  const [query, setQuery] = useState("");
  const [post, setPost] = useState([]);

  useEffect(() => {
    fetchAuthors();
    fetchFollowingAuthors();
  }, []);

  const fetchAuthors = async () => {
    const newAuthors = await apiService.get(
      `http://localhost:6819/api/Author?pageSize=10&pageNumber=${
        authors?.pageNumber || 1
      }`
    );
    setAuthors((prevState) => ({
      ...prevState,
      items: newAuthors,
      loading: false,
    }));
  };

  const fetchFollowingAuthors = async () => {
    var author = await apiService.get(
      `http://localhost:6819/api/Author/FollowingAuthors`
    );
    setFollowingAuthor(author);
  };

  const handleSearch = async (event) => {
    if (event.key === "Enter") {
      debugger;
      if (query === "") {
        fetchAuthors();
      } else {
        setAuthors({ ...authors, loading: true });
        const searchResult = await apiService.get(
          `http://localhost:6819/api/Author/FindAuthor?query=${query}`
        );
        setAuthors({ items: searchResult, loading: false });
      }
    }
  };

  const handleAuthorClick = async (id) => {
    const post = await apiService.get(
      `http://localhost:6819/api/Post/User/${id}`
    );
    setPost(post);
  };

  const handleTabChanged = async (tabName) => {
    switch (tabName) {
      case "author":
        fetchAuthors();
        break;
      case "following":
        fetchFollowingAuthors();
        break;
      default:
        break;
    }
  };

  const handleFollowAuthorClick = async (followUserId) => {
    var data = {
      UserId: getUserId(),
      FollowingUserId: followUserId,
    };

    const response = await apiService.post(
      `http://localhost:6819/api/Author/FollowAuthor`,
      data
    );

    if (response.status == 200) {
      setAuthors((prevState) => {
        const updatedItems = prevState.items.map((author) => {
          if (author.userId === followUserId) {
            return { ...author, isFollowing: true };
          }
          return author;
        });

        console.log("previus state", prevState.items);
        console.log("new state", updatedItems);

        return { ...prevState, items: updatedItems };
      });
    }
  };

  const unfollowAuthorClick = async (followerId) => {
    const data = {
      FollowerId: followerId,
    };
    const response = await apiService.post(
      `http://localhost:6819/api/Author/DeleteFollower`,
      data
    );

    setFollowingAuthor((prevAuthors) =>
      prevAuthors.filter((author) => author.followerId !== followerId)
    );
  };

  const loadMoreAuthors = async () => {
    const nextPage = authors.pageNumber + 1;
    setAuthors((prevState) => ({ ...prevState, loading: true }));

    const newAuthors = await apiService.get(
      `http://localhost:6819/api/Author?pageSize=10&pageNumber=${nextPage}`
    );

    setAuthors((prevState) => ({
      items: [...prevState.items, ...newAuthors],
      pageNumber: nextPage,
      loading: false,
    }));
  };

  const renderAuthorItem = (item) => {
    const actions = [];
    if (!item.isFollowing) {
      actions.push(
        <Button
          type="link"
          className="orange-btn"
          onClick={() => handleFollowAuthorClick(item.userId)}
        >
          Follow
        </Button>
      );
    } else {
      actions.push(
        <Button type="link" className="orange-btn">
          Following
        </Button>
      );
    }

    return (
      <List.Item actions={actions}>
        <Skeleton avatar loading={item.loading} active>
          <List.Item.Meta
            avatar={<Avatar src={item.picture} />}
            title={
              <div>
                <a onClick={() => handleAuthorClick(item.userId)}>
                  {item.firstName} {item.lastName}
                </a>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  {item.bio}
                </div>
                <div style={{ fontSize: "12px", color: "#888" }}>20 posts</div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  12 Followers
                </div>
              </div>
            }
          />
        </Skeleton>
      </List.Item>
    );
  };

  const renderFollowAuthorItem = (item) => {
    return (
      <List.Item
        actions={[
          <Button
            type="link"
            key={item.followerId}
            className="orange-btn"
            onClick={() => unfollowAuthorClick(item.followerId)}
          >
            Unfollow
          </Button>,
        ]}
      >
        <Skeleton avatar loading={item.loading} active>
          <List.Item.Meta
            avatar={<Avatar src={item.picture} />}
            title={
              <a onClick={() => handleAuthorClick(item.userId)}>
                {item.firstName} {item.lastName}
              </a>
            }
            description={item.bio}
          />
        </Skeleton>
      </List.Item>
    );
  };

  const authorSearchInput = (
    <Input
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleSearch}
      size="large"
      placeholder="Search author..."
      className="discussify-input"
      suffix={
        <Tooltip title="Search">
          <SearchOutlined />
        </Tooltip>
      }
      variant="borderless"
    />
  );

  const authorTabContent = (
    <div>
      {authorSearchInput}
      <List
        className="author-list"
        loading={authors.loading}
        itemLayout="horizontal"
        dataSource={authors.items}
        renderItem={renderAuthorItem}
        loadMore={
          !authors.loading && (
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Button onClick={loadMoreAuthors}>Load more</Button>
            </div>
          )
        }
      />
    </div>
  );

  const followingAuthorTabContent = (
    <div>
      <List
        className="author-list"
        itemLayout="horizontal"
        dataSource={followingAuthor}
        renderItem={renderFollowAuthorItem}
      />
    </div>
  );

  const postListContent = (
    <List
      className="post-list"
      loading={authors.loading}
      itemLayout="horizontal"
      dataSource={post}
      renderItem={(item) => (
        <List.Item>
          <Skeleton avatar loading={item.loading} active>
            <List.Item.Meta
              avatar={<Avatar src={item.imageUrl} shape="square" size={64} />}
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
  );

  const tabItems = [
    { label: "Author", key: "author", children: authorTabContent },
    {
      label: "My Follower",
      key: "follower",
      children: <Text>My Followers</Text>,
    },
    {
      label: "Im Following",
      key: "following",
      children: followingAuthorTabContent,
    },
  ];

  return (
    <>
      <Navigation />
      <Row style={{ padding: "8px" }}>
        <Col span={8} style={{ padding: "5px" }}>
          <Card>
            <Tabs
              onChange={handleTabChanged}
              defaultActiveKey="1"
              type="card"
              size="large"
              items={tabItems}
            />
          </Card>
        </Col>
        <Col span={16} style={{ padding: "5px" }}>
          <Card>{postListContent}</Card>
        </Col>
      </Row>
    </>
  );
};

export default Author;

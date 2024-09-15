import React, { useEffect, useState } from "react";
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
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Navigation from "../../components/NavBar/Navbar.jsx";

const { Text, Link, Title } = Typography;
const count = 10;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const AuthorTest = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setData(res.results);
        setList(res.results);
      });
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
    }
  };

  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat(
        [...new Array(count)].map(() => ({
          loading: true,
          name: {},
          picture: {},
        }))
      )
    );
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        const newData = data.concat(res.results);
        console.log(newData);
        setData(newData);
        setList(newData);
        setLoading(false);
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event("resize"));
      });
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
      <Row style={{ padding: "10px" }}>
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
                    <a key="list-loadmore-edit">edit</a>,
                    <a key="list-loadmore-more">more</a>,
                  ]}
                >
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      avatar={<Avatar src={item.picture.large} />}
                      title={<a href="https://ant.design">{item.name?.last}</a>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                    <div>content</div>
                  </Skeleton>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={16} style={{ padding: "5px" }}>
          <Card></Card>
        </Col>
      </Row>
    </>
  );
};

export default AuthorTest;

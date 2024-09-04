import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useApiService from "../../service/apiService.jsx";
import useAuthService from "../../service/authService.jsx";
import Navigation from "../../components/NavBar/Navbar.jsx";

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
import "./QuickSearch.css";

const { Text, Link, Title } = Typography;

const QuickSearch = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const apiService = useApiService();
  const [post, setPost] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const post = await apiService.get(
      `http://localhost:6819/api/QuickSearch?query=${query}`
    );
    setPost(post);
  };

  return (
    <>
      <Navigation></Navigation>
      {post.map((p, key) => {
        return (
          <>
            <Card key={post.postId} className="quick-search-card">
              <Row>
                <Col>
                  <Image
                    src={p.imageUrl}
                    width={100}
                    height={80}
                    style={{ borderRadius: 5 }}
                  />
                </Col>
                <Col style={{ marginLeft: 20 }}>
                  <Flex vertical>
                    <Link href={`/Post/${p.postId}`} className="title-link">
                      {p.title}
                    </Link>

                    <Text style={{ color: "#858EAD" }}>{p.description}</Text>
                  </Flex>
                </Col>
              </Row>
            </Card>
          </>
        );
      })}
    </>
  );
};

export default QuickSearch;

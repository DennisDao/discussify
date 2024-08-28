import React, { useState, useEffect } from "react";
import { Typography, Card } from "antd";
import Topic from "./Topic.jsx";
import useApiService from "../../service/apiService.jsx";

const { Text, Link, Title } = Typography;

const CategoriesCard = () => {
  const [categories, setCategories] = useState([]);
  const apiService = useApiService();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const categories = await apiService.get(
      "http://localhost:6819/api/Category"
    );
    setCategories(categories);
  };

  return (
    <>
      <Card style={{ marginTop: 16 }}>
        <Title level={4} style={{ color: "white", marginBottom: "20px" }}>
          Popular Categories
        </Title>

        {categories.map((c, key) => {
          return (
            <>
              <Topic
                title={c.description}
                description="100 post by this tag"
                component={<img src={c.image} width={30} />}
              />
            </>
          );
        })}
      </Card>
    </>
  );
};

export default CategoriesCard;

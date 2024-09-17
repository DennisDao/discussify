import React, { useState, useEffect } from "react";
import useApiService from "../../service/apiService.jsx";
import Navigation from "../../components/NavBar/Navbar.jsx";
import { List, Avatar, Row, Col, Card, Typography } from "antd";

const Activity = () => {
  const apiService = useApiService();
  const [activites, setActivites] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    var activites = await apiService.get(
      "http://localhost:6819/api/Activity/1"
    );
    setActivites(activites);
  };

  return (
    <>
      <Navigation></Navigation>

      {activites.map((activity, key) => {
        return (
          <>
            <Card
              style={{ margin: "20px" }}
              title={activity.whenCreated}
              key={key}
            >
              <List
                itemLayout="horizontal"
                dataSource={activity.activities}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image} />}
                      title={<a href="https://ant.design">{item.title}</a>}
                      description={item.content}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </>
        );
      })}
    </>
  );
};

export default Activity;

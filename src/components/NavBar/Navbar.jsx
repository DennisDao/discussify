import React from 'react';
import './Navbar.css';
import { Row, Col } from 'antd';
import { Avatar, Input, Tooltip, Typography, Button, Flex,Image } from "antd";
import { ClockCircleOutlined, SearchOutlined,HomeOutlined,CalendarOutlined,UserOutlined, MessageOutlined,BellOutlined } from '@ant-design/icons';


const { Text } = Typography;

const Navigation = () => {

  return <>
    <Row id='app-navbar' className='nav-bar'>
      <Col span={8} className='nav-bar-menu-left'>
      <Flex gap="middle" align="start" justify="space-between">
          <Typography.Title level={3} style={{ color: '#FF571A', marginBottom: '0px', fontWeight: 'bold'  }} font>
            DISCUSSIFY
          </Typography.Title>

         <Flex align="center">
            <Button shape="square" size="large" type="text" className='nav-bar-button' style={{ fontSize: "1.5rem"  }}>
              <HomeOutlined />
            </Button>
            <Button shape="square" size="large" type="text" className='nav-bar-button' style={{ fontSize: "1.5rem"  }}>
              <CalendarOutlined />
            </Button>
            <Button shape="square" size="large" type="text" className='nav-bar-button' style={{ fontSize: "1.5rem"  }}>
              <UserOutlined /> 
            </Button>
            <Button shape="square" size="large" type="text" className='nav-bar-button' style={{ fontSize: "1.5rem"  }}>
              <ClockCircleOutlined />
            </Button>
          </Flex>

        </Flex>
      </Col>

      <Col span={8}>
      <Input
            size="large"
            placeholder="Type here to search..."
            hoverBorderColor="#ffffff"
            suffix={
            <Tooltip title="Search">
              <SearchOutlined style={{ color: 'white' }} />
            </Tooltip>
            }
            className={'input-dark'}
            variant="borderless"
          />
      </Col>

      <Col span={8}>
        <Flex align="center" justify="flex-end">
              <Button shape="square" size="large" type="text" className='nav-bar-button' style={{ fontSize: "1.5rem"  }}>
                <MessageOutlined />
              </Button>
              <Button shape="square" size="large" type="text" className='nav-bar-button' style={{ fontSize: "1.5rem"  }}>
                <BellOutlined />
              </Button>
              <Button shape="square" size="large" type="text" className='nav-bar-button navbar-avatar-button' style={{ fontSize: "1.5rem"  }}>
                  <Avatar src="/Assets/Users/dennis.png"/>
             </Button>
             <Text type='secondary' style={{ color: 'white', marginBottom: '0px', fontWeight: "bold"  }}>
                Dennis D
              </Text>
        </Flex>
      </Col>
    </Row>

  </>;
};

export default Navigation;
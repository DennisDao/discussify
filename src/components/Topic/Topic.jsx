import React from 'react';
import { Typography, Button, Flex, Input } from 'antd';

const { Text, Link, Title } = Typography;

const Topic = ({title, description, component, iconbackground}) => {
    return (
        <>
        <Flex align="center"  style={{ marginBottom: '15px'}}>
            <div style={{ marginRight: '15px'  }}>
              <Button shape="square" size="large" type="text" className='nav-bar-button' style={{ fontSize: "1.5rem", background: iconbackground  }}>
                {component}
              </Button>
            </div>
            <div>
              <Title level={4} style={{ color: 'white', marginBottom: '0px'  }}>
                {title}
              </Title>

              <Text type='secondary' style={{ color: 'white', marginBottom: '0px'  }}>
                {description}
              </Text>
            </div>
         </Flex>
        </>
    );
};

export default Topic;
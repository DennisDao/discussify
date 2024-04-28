import React from 'react';
import { Row, Col,Card,Meta,Avatar,Typography, Button, Flex } from 'antd';
import {  CalendarOutlined } from '@ant-design/icons';
import  TextEditor from '../../components/Editor/TextEdidtor.jsx'

import Icon from '@ant-design/icons';
import './post.css';

const { Text, Link, Title } = Typography;



const Post = () => {
    return (
        <>
            <Row>
                <Col span={6}/>
                <Col span={12} >
                    <Card style={{ marginTop: 16 }} >
                            Show post and comments here...
                    </Card>
                </Col>
                <Col span={6}/>
            </Row>

            <Row id='comment-control'>
                <Col span={6}/>
                <Col span={12} >
                    <Card style={{ marginTop: 16}} id="text-editor-container">
                        <TextEditor></TextEditor>
                    </Card>
                </Col>
                <Col span={6}/>
            </Row>
        </>
    );
};

export default Post;
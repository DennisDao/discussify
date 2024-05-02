import React, { useState,useCallback  } from 'react';
import { Row, Col,Card,Typography,Avatar, Flex} from 'antd';
import  TextEditor from '../../components/TextEditor/TextEdidtor.jsx'
import './post.css';

const { Text, Link, Title } = Typography;

const usercomment = [
    {
      type: 'paragraph',
      children: [{ text: ''}],
    },
  ]
const comment = [{"type":"paragraph","children":[{"text":"this is my code"}]},{"type":"paragraph","children":[{"text":""}]},{"type":"paragraph","children":[{"text":"this is a code block","type":"code"}]},{"type":"paragraph","children":[{"type":"code","text":"more code block..."}]}];

const Post = () => {

    const [comments, setComments] = useState([]);

    const addComment = (comment) => {
        debugger;
        setComments([...comments, comment]);
    };

    return (
        <>
            <Row>
                <Col span={6}/>
                <Col span={12} id="comment-container">
                    {comments.map((comment, index) => (
                        <Card style={{ marginTop: 16 }}>
                            <Flex>
                                <Avatar
                                    size={{ xs: 24, sm: 32, md: 40, lg: 45, xl: 50, xxl: 55 }}
                                    src="/Assets/Users/Kim.jpg"
                                    style={{ marginRight: '20px'  }}
                                />
                                <TextEditor isReadOnly={true} showToolBar={false} comment={comment}></TextEditor>
                            </Flex>   
                        </Card>
                    ))}
                </Col>
                <Col span={6}/>
            </Row>

            <Row id='comment-control'>
                <Col span={6}/>
                <Col span={12} >
                    <Card style={{ marginTop: 16}} id="text-editor-container">
                        <TextEditor isReadOnly={false} showToolBar={true} comment={usercomment} onCommentAdded={addComment}></TextEditor>
                    </Card>
                </Col>
                <Col span={6}/>
            </Row>
        </>
    );
};

export default Post;
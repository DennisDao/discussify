import React, { useState,useCallback  } from 'react';
import { Divider } from 'antd';
import { Editor,createEditor,Transforms, Text  } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { IconButton } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code
} from "@mui/icons-material";

const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.'}],
    },
  ]

  const CodeElement = props => {
    return (
      <pre {...props.attributes}>
        <code style={{ color: '#c8e6c9' }}>{props.children}</code>
      </pre>
    )
  }
  
  const DefaultElement = props => {
    return (
      <span
        {...props.attributes}
        style={{
          fontWeight: props.leaf.bold ? "bold" : "normal",
          fontStyle: props.leaf.italic ? "italic" : "normal",
          textDecoration: props.leaf.underline ? "underline" : "none"
        }}
      >
        {props.children}
      </span>)
  }

const TextEditor = () => {
    const [editor] = useState(() => withReact(createEditor()))

    function changeMark(mark) {
        const [match] = Editor.nodes(editor, {
          match: (n) => n[mark] // check for existing formatting
        });
    
        Transforms.setNodes(
          editor,
          { [mark]: !match }, // sets the formatting value
          { match: (n) => Text.isText(n), split: true }
        );
      }

      function changeType(type) {
        const [match] = Editor.nodes(editor, {
          match: (n) => n.type === type
        });
        Transforms.setNodes(
          editor,
          { type: match ? null : type },
          { match: (n) => Editor.isBlock(editor, n) }
        );
      }
    
      const renderElement = useCallback(props => {
        switch (props.leaf.type) {
          case "code":
            return <CodeElement {...props} />
          default:
            return <DefaultElement {...props} />
        }
      }, [])

      const onKeyDown = (event) => {
        if (!event.ctrlKey) {
          return;
        }
    
        event.preventDefault(); // prevents default browser behaviour
    
        switch (event.key) {
          case "b": {
            changeMark("bold");
            break;
          }
    
          case "i": {
            changeMark("italic");
            break;
          }
    
          case "u": {
            changeMark("underline");
            break;
          }
          default: {
            break;
          }
        }
      };


    return (
        <>
            <div style={{ display: `flex` }}>
              <IconButton style={{ color: "grey" }}  onPointerDown={(e) => { changeMark("bold")}}>
                <FormatBold />
              </IconButton>

              <IconButton style={{ color: "grey" }}  onPointerDown={(e) => { changeMark("italic")}}>
                <FormatItalic />
              </IconButton>

              <IconButton style={{ color: "grey" }} onPointerDown={(e) => { changeMark("underline")}}>
                <FormatUnderlined />
              </IconButton>

              <IconButton style={{ color: "grey" }} onPointerDown={(e) => { changeType("code")}}>
                <Code />
              </IconButton>
            </div>
 
          <Slate editor={editor} initialValue={initialValue}   onChange={value => {
                const isAstChange = editor.operations.some(
                  op => 'set_selection' !== op.type
                )
                if (isAstChange) {
                  // Save the value to Local Storage.
                  const content = JSON.stringify(value)
                  localStorage.setItem('content', content)
                  console.log(content);
                }
              }}>
            <Editable 
              onKeyDown={onKeyDown} 
              renderLeaf={renderElement}   
              style={{
                backgroundColor: '#2C353D',
                minHeight: '100px',
                outline: "none",
                color: "#ffffff"
              }}
            />
          </Slate>
        </>
    );
};

export default TextEditor;
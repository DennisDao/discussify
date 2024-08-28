import React, { useState, useCallback } from "react";
import { Editor, createEditor, Transforms, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { IconButton } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
  Save,
} from "@mui/icons-material";

const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code style={{ color: "#c8e6c9" }}>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
        textDecoration: props.leaf.underline ? "underline" : "none",
      }}
    >
      {props.children}
    </span>
  );
};

const TextEditor = ({
  isReadOnly,
  showToolBar,
  comment = [],
  onCommentAdded,
}) => {
  const [editor] = useState(() => withReact(createEditor()));
  const [comment1, setComment] = useState();

  function changeMark(mark) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n[mark], // check for existing formatting
    });

    Transforms.setNodes(
      editor,
      { [mark]: !match }, // sets the formatting value
      { match: (n) => Text.isText(n), split: true }
    );
  }

  function changeType(type) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === type,
    });
    Transforms.setNodes(
      editor,
      { type: match ? null : type },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  }

  const AddComment = () => {
    debugger;
    onCommentAdded(comment1);
  };

  const renderElement = useCallback((props) => {
    switch (props.leaf.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

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
      {showToolBar == true && (
        <div style={{ display: `flex`, position: "fixed", zIndex: "1" }}>
          <IconButton
            style={{ color: "grey" }}
            onPointerDown={(e) => {
              changeMark("bold");
            }}
          >
            <FormatBold />
          </IconButton>

          <IconButton
            style={{ color: "grey" }}
            onPointerDown={(e) => {
              changeMark("italic");
            }}
          >
            <FormatItalic />
          </IconButton>

          <IconButton
            style={{ color: "grey" }}
            onPointerDown={(e) => {
              changeMark("underline");
            }}
          >
            <FormatUnderlined />
          </IconButton>

          <IconButton
            style={{ color: "grey" }}
            onPointerDown={(e) => {
              changeType("code");
            }}
          >
            <Code />
          </IconButton>

          <IconButton
            style={{ color: "grey" }}
            onPointerDown={(e) => {
              AddComment();
            }}
          >
            <Save />
          </IconButton>
        </div>
      )}

      <Slate
        editor={editor}
        initialValue={comment}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            // Save the value to Local Storage.
            const content = JSON.stringify(value);
            localStorage.setItem("content", content);
            setComment(value);
          }
        }}
      >
        <Editable
          onKeyDown={onKeyDown}
          renderLeaf={renderElement}
          style={{
            backgroundColor: "#2C353D",
            minHeight: "100px",
            outline: "none",
            color: "#ffffff",
            marginTop: "40px",
          }}
          readOnly={isReadOnly}
        />
      </Slate>
    </>
  );
};

export default TextEditor;

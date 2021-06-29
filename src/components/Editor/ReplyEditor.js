import React, { useState } from "react";
import "./style.css";
import { v4 as uuidv4 } from "uuid";

let commentObj = {
  id: null,
  comment: "",
  likesCount: 0,
  dislikeCount: 0,
  level: 2,
  timestamp: "",
  parentID: "",
};

const ReplyEditor = (props) => {
  const [comment, setComment] = useState(commentObj);
  const [editedComment, setEditedComment] = useState(
    props.commentData ? props.commentData.comment : ""
  );
  let newComment = {};

  const addComment = (e) => {
    e.preventDefault();
    if (props.reply) {
      newComment = {
        ...comment,
        level: props.level + 1,
        id: uuidv4(),
        comment: editedComment,
        parentID: props.parentID,
        timestamp: new Date(Date.now()).toGMTString(),
      };
    } else {
      newComment = {
        ...props.commentData,
        comment: editedComment,
      };
    }
    console.log(newComment);
    props.onAdd(newComment);
    setComment(commentObj);
  };

  const onCancel = (e) => {
    props.onCancel(comment);
    setComment(commentObj);
  };

  const onEditorChange = (e) => {
    setEditedComment(e.target.value);
    console.log(editedComment);
  };

  return (
    <div className="editor-container">
      <form onSubmit={addComment}>
        <textarea
          autoFocus
          name="editor"
          rows="2"
          cols="60"
          value={editedComment}
          onChange={onEditorChange}
        ></textarea>
        <button
          type="submit"
          className="add-btn"
          disabled={!editedComment.length}
        >
          Add
        </button>
      </form>
      <button className="cancel-btn" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default ReplyEditor;

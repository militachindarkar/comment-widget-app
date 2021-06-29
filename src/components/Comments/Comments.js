import React, { useState } from "react";
import "./style.css";
import ReplyEditor from "../Editor/ReplyEditor.js";

const Comments = (props) => {
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [showEditEditor, setShowEditEditor] = useState(false);

  const onReplyClick = () => {
    setShowReplyEditor((prevState) => !prevState);
  };

  const onReplyCancel = () => {
    setShowReplyEditor((prevState) => !prevState);
  };

  const onReplyAdd = (newComment) => {
    setShowReplyEditor((prevState) => !prevState);
    props.onReplyClick(newComment);
  };

  const onEditBtnClick = (newComment) => {
    setShowEditEditor((prevState) => !prevState);
  };

  const onEditCancel = () => {
    setShowEditEditor((prevState) => !prevState);
  };

  const onEditComment = (newComment) => {
    setShowEditEditor((prevState) => !prevState);
    props.onEditClick(newComment);
  };

  return (
    <div className="comments-container">
      <div
        className={`comment-block ${
          props.itemData.level === 2
            ? "level-2"
            : `${props.itemData.level === 3 ? "level-3" : ""}`
        }`}
      >
        <p className="commnet-area">{props.itemData.comment}</p>
        <div className="action-bar">
          {props.itemData.level < 3 ? (
            <button
              className="reply-btn"
              data-level={props.itemData.level}
              data-comment_id={props.itemData.id}
              onClick={onReplyClick}
            >
              Reply
            </button>
          ) : null}
          <button
            className="edit-btn"
            data-comment_id={props.itemData.id}
            onClick={onEditBtnClick}
          >
            Edit
          </button>
          <button
            className="delete-btn"
            data-comment_id={props.itemData.id}
            onClick={props.onDeleteClick}
            data-level={props.itemData.level}
          >
            Delete
          </button>
          <button
            className="like-btn"
            data-likes={props.itemData.likesCount}
            data-comment_id={props.itemData.id}
            onClick={props.onLikeClick}
          >
            Like ({props.itemData.likesCount})
          </button>
          <button
            className="dislike-btn"
            data-dislikes={props.itemData.dislikeCount}
            data-comment_id={props.itemData.id}
            onClick={props.onDislikeClick}
          >
            Dislike ({props.itemData.dislikeCount})
          </button>
          <span className="time-stamp">{props.itemData.timestamp}</span>
        </div>
        {showReplyEditor ? (
          <ReplyEditor
            onCancel={onReplyCancel}
            onAdd={onReplyAdd}
            reply={true}
            parentID={props.itemData.id}
            level={props.itemData.level}
          />
        ) : null}
        {showEditEditor ? (
          <ReplyEditor
            onCancel={onEditCancel}
            onAdd={onEditComment}
            reply={false}
            commentData={props.itemData}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Comments;

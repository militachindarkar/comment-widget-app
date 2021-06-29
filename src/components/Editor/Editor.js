import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./style.css";
import Comments from "../Comments/Comments.js";

let commentObj = {
  id: null,
  comment: "",
  likesCount: 0,
  dislikeCount: 0,
  level: 1,
  timestamp: "",
  parentID: "",
};
const Editor = () => {
  const [comment, setComment] = useState(commentObj);
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    // if localstorage has "comments" array with length > 0 and "commentList" is empty
    // then populate "commentList" with localstorage data
    // else store "commentList" to localstorage
    if (
      JSON.parse(localStorage.getItem("comments")) &&
      JSON.parse(localStorage.getItem("comments")).length &&
      commentList.length === 0
    )
      setCommentList(JSON.parse(localStorage.getItem("comments")));
    else {
      localStorage.setItem("comments", JSON.stringify(commentList));
    }
  }, [commentList]);

  const mapCommentListData = (newCommentList) => {
    const level1Comments = newCommentList.filter((item) => item.level === 1);
    const level2Comments = newCommentList.filter((item) => item.level === 2);
    const level3Comments = newCommentList.filter((item) => item.level === 3);

    let finalList = [];
    level1Comments.forEach((level1_item) => {
      finalList.push(level1_item);
      level2Comments.forEach((level2_item) => {
        if (level2_item.parentID === level1_item.id) {
          finalList.push(level2_item);
          level3Comments.forEach((level3_item) => {
            if (level3_item.parentID === level2_item.id) {
              finalList.push(level3_item);
            }
          });
        }
      });
    });
    return finalList;
  };
  // calls after Add button click
  const addComment = (e) => {
    e.preventDefault();
    setComment({
      ...comment,
      level: 1,
    });

    setCommentList([...commentList, comment]);
    setComment(commentObj);
  };

  // calls after Cancel button click
  const onCancel = (e) => {
    setComment(commentObj);
  };

  const onEditorChange = (e) => {
    setComment({
      ...comment,
      id: uuidv4(),
      comment: e.target.value,
      timestamp: new Date(Date.now()).toGMTString(),
    });
  };

  const likeHandler = (e) => {
    let likes = e.target.dataset.likes;
    setCommentList(
      commentList.map((item) =>
        item.id === e.target.dataset.comment_id
          ? { ...item, likesCount: parseInt(likes) + 1 }
          : item
      )
    );
  };

  const dislikeHandler = (e) => {
    let dislikes = e.target.dataset.dislikes;
    setCommentList(
      commentList.map((item) =>
        item.id === e.target.dataset.comment_id
          ? { ...item, dislikeCount: parseInt(dislikes) + 1 }
          : item
      )
    );
  };

  const replyHandler = (newComment) => {
    const newCommentList = [...commentList, newComment];
    const finalList = mapCommentListData(newCommentList);
    setCommentList(finalList);
  };

  const editHandler = (editedComment) => {
    setCommentList(
      commentList.map((item) =>
        item.id === editedComment.id
          ? { ...item, comment: editedComment.comment }
          : item
      )
    );
  };

  const deleteHandler = (e) => {
    const current_id = e.target.dataset.comment_id;
    const current_level = e.target.dataset.level;
    const newCommentList = [...commentList];

    let newList1 = newCommentList.filter((item) => item.id !== current_id);

    if (Number(current_level) === 2) {
      newList1 = newList1.filter((item) => item.parentID !== current_id);
    } else if (Number(current_level) === 1) {
      let newList2 = newList1.filter((item) => item.parentID === current_id);
      newList1 = newList1.filter((item) => item.parentID !== current_id);

      newList2.forEach((x) => {
        newList1 = newList1.filter((item) => item.parentID !== x.id);
      });
    }

    setCommentList(newList1);
  };

  return (
    <>
      <div className="editor-container">
        <form onSubmit={addComment}>
          <textarea
            autoFocus
            name="editor"
            rows="2"
            cols="60"
            value={comment.comment}
            onChange={onEditorChange}
          ></textarea>
          <button
            type="submit"
            className="add-btn"
            disabled={!comment.comment.length}
          >
            Add
          </button>
        </form>
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
      {!commentList.length ? (
        <p className="no-commnets">No comments yet!</p>
      ) : (
        commentList.map((item) => (
          <Comments
            key={item.id}
            itemData={item}
            onLikeClick={likeHandler}
            onDislikeClick={dislikeHandler}
            onReplyClick={replyHandler}
            onEditClick={editHandler}
            onDeleteClick={deleteHandler}
            level={item.level}
            timestamp={item.timestamp}
          />
        ))
      )}
    </>
  );
};

export default Editor;

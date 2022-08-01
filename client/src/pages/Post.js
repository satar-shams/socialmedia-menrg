import { useMutation, useQuery } from '@apollo/client';
import React, { useContext, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DeleteButton from '../components/DeleteButton';
import { Auth } from '../context/auth';
import { FETCH_POST_QUERY } from '../utils/graphqlQuery';
import moment from 'moment';
import LikeButton from '../components/LikeButton';
import { SUBMIT_COMMENT_MUTATION } from '../utils/graphqlMutations';
function Post() {
  const params = useParams();
  const { postId } = params;
  const { state } = useContext(Auth);
  const { user } = state;
  const commentInputRef = useRef(null);
  const [commentAdd, setCommentAdd] = useState('');

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setCommentAdd('');
    },
    variables: {
      postId,
      body: commentAdd,
    },
  });

  const submitCommentHandler = (e) => {
    e.preventDefault();
    submitComment();
    commentInputRef.current.blur();
  };

  let postMarkup;
  if (data) {
    if (!data.getPost) {
      postMarkup = <div className="loader"></div>;
    } else {
      const {
        id,
        body,
        createdAt,
        username,
        image,
        postImage,
        comments,
        likes,
        likeCount,
        commentCount,
      } = data.getPost;
      postMarkup = (
        <div>
          <div className="content">
            <div className="details">
              <div>
                <div className="detail">
                  <div className="detail-header">
                    <div>
                      <Link to={`/profile/${username}`}>
                        <img
                          className="detail-header-image"
                          src={`/images/profiles/${image}`}
                          alt={'user'}
                        />
                      </Link>

                      <span className="detail-hearder-username">
                        {username}
                      </span>
                    </div>

                    <div>
                      {user && user.username === username && (
                        <DeleteButton postId={id} />
                      )}
                    </div>
                  </div>
                  <div>
                    <img
                      className="detail-image"
                      src={`/images/posts/${postImage}`}
                      alt="cart"
                    />
                  </div>
                  <div className="cart-action">
                    <div>
                      <LikeButton
                        user={user}
                        post={{
                          id: id,
                          likes: likes,
                          likeCount: likeCount,
                        }}
                      />
                      <i
                        style={{ color: 'blue' }}
                        class="fa-regular fa-comment"
                      ></i>{' '}
                      <span className="comment-count"> {commentCount} </span>{' '}
                    </div>
                    <div>{moment(createdAt).fromNow(true)} ago</div>
                  </div>
                  <div>{body}</div>

                  {user.username && (
                    <div>
                      <form>
                        Add a comment
                        <br />
                        <input
                          type="text"
                          name="comment"
                          id="comment"
                          value={commentAdd}
                          onChange={(e) => setCommentAdd(e.target.value)}
                        ></input>
                        <button
                          type="submit"
                          disabled={commentAdd.trim() === ''}
                          onClick={submitCommentHandler}
                        >
                          add comment
                        </button>
                      </form>
                    </div>
                  )}
                  <hr />

                  <div>{commentCount} comments</div>
                  <br />
                  {comments.map((comment) => (
                    <div>
                      <div className="detail-header">
                        <div>
                          <Link to={`/profile/${comment.username}`}>
                            <img
                              className="detail-header-image"
                              src={`/images/profiles/${comment.image}`}
                              alt={'user'}
                            />
                          </Link>{' '}
                          <span className="detail-hearder-username">
                            {comment.username}
                          </span>
                        </div>
                        <div>
                          {user.username &&
                            user.username === comment.username && (
                              <DeleteButton
                                postId={id}
                                commentId={comment.id}
                              />
                            )}
                        </div>
                      </div>
                      {moment(comment.createdAt).fromNow(true)}
                      {' ago'}
                      <br />
                      <br />
                      <div className="comment-context">{comment.body}</div>
                      <br />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      SinglePost
      <br />
      <br />
      {postMarkup}
    </div>
  );
}

export default Post;

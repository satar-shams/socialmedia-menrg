import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { LIKE_POST_MUTATION } from '../utils/graphqlMutations';
function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  return (
    <span>
      {liked ? (
        <i
          onClick={likePost}
          style={{ color: 'red' }}
          class="fa-solid fa-heart"
        ></i>
      ) : (
        <i onClick={likePost} class="fa-regular fa-heart"></i>
      )}{' '}
      {likeCount}{' '}
    </span>
  );
}

export default LikeButton;

import React from 'react';
import { Link } from 'react-router-dom';
function PostCard({
  post: { id, body, createdAt, username, likeCount, commentCount, likes },
}) {
  return (
    <div>
      PostCard {createdAt}
      <Link to={`/posts/${id}`}>{id}</Link>
    </div>
  );
}

export default PostCard;

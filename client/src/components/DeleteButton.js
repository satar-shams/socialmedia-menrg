import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DELETE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
} from '../utils/graphqlMutations';
import { FETCH_POSTS_QUERY } from '../utils/graphqlQuery';

function DeleteButton({ postId, commentId }) {
  const navigate = useNavigate();
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((p) => p.id !== postId),
          },
        });
        navigate('/');
      }
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <i
      style={{ color: 'red', cursor: 'pointer' }}
      class="fa-solid fa-trash-can"
      onClick={() => {
        if (window.confirm('Are you sure you wish to delete this item?')) {
          deletePostOrComment();
        } else {
        }
      }}
    ></i>
  );
}

export default DeleteButton;

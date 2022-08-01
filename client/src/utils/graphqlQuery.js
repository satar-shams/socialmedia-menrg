import { gql } from '@apollo/client';
export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      image
      postImage
      likeCount
      commentCount
      likes {
        # id        # createdAt
        username
        image
      }
      comments {
        id
        username
        image
        createdAt
        body
      }
    }
  }
`;

export const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      image
      postImage
      likeCount
      commentCount

      likes {
        username
        image
      }

      comments {
        id
        username
        image
        createdAt
        body
      }
    }
  }
`;

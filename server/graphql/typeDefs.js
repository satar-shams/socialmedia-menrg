const { gql } = require('apollo-server');
//we need to define all types that we want to use an a gql: like models for mongoose
module.exports = typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    image: String!
    postImage: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    body: String!
    username: String!
    image: String!
    createdAt: String!
  }
  type Like {
    id: ID!
    username: String!
    image: String!
    createdAt: String!
  }
  type User {
    id: ID! #that means we must return this field
    email: String!
    token: String!
    username: String!
    image: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    image: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!, image: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post! #this is toggle so we dont need unlike
    updateUser(registerInput: RegisterInput): User!
  }
`;

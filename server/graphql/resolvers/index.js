const postQueryResolvers = require('./postsQueries');
const postMutationResolvers = require('./postMutations');
const commentMutationResolvers = require('./commentsMutations');
const userMutationsResolvers = require('./userMutations');
const updateMutationResolvers = require('./updateMutations');

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postQueryResolvers.Query,
  },
  Mutation: {
    ...postMutationResolvers.Mutation,
    ...commentMutationResolvers.Mutation,
    ...userMutationsResolvers.Mutation,
    ...updateMutationResolvers.Mutation,
  },
};

const { UserInputError, AuthenticationError } = require("apollo-server-errors");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
module.exports = {
    Mutation: {
        createComment: async (parent, { body, postId }, context) => {
            const user = checkAuth(context);
            // validate comment body
            if (body.trim() === "") {
                throw new UserInputError("Empty Comment", {
                    errors: {
                        body: "Comment body must not be empty",
                    },
                });
            }
            // find post in db
            const post = await Post.findById(postId);
            if (post) {
                // insert the comment on the top of the array
                post.comments.unshift({
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString(),
                });
                await post.save();
                return post;
            } else throw new UserInputError("Post not found");
        },
        deleteComment: async (parent, { postId, commentId }, context) => {
            const { username } = checkAuth(context);
            try {
                const post = await Post.findById(postId);
                if (post) {
                    const commentIndex = post.comments.findIndex(
                        (comment) => comment.id === commentId
                    );
                    // FIXME: While working in an async and distributed system can cause
                    // data inconsistencies.
                    if (commentIndex!==-1 && post.comments[commentIndex].username === username) {
                        post.comments.splice(commentIndex, 1);
                        await post.save();
                        return post;
                    } else {
                        throw new AuthenticationError("Action not allowed");
                    }
                } else {
                    throw new UserInputError("Post not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },
};

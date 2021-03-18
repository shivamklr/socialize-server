const { UserInputError } = require("apollo-server-errors");
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
    },
};

const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        getPost: async (parent, { postId }) => {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error("Post not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        createPost: async (parent, args, context) => {
            const user = checkAuth(context);
            const newPost = new Post({
                body: args.body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
            });
            const post = await newPost.save();
            return post;
        },
        deletePost: async (parent, { postId }, context) => {
            const user = checkAuth(context);
            try {
                const post = await Post.findById(postId);
                console.log(user.id, JSON.stringify(post.user));
                if (user.username === post.username) {
                    post.delete();
                    return "Post deleted successfully";
                }
                throw new AuthenticationError("Action not allowed");
            } catch (err) {
                throw new Error(err);
            }
        },
    },
};

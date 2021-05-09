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
            const user = await checkAuth(context);
            if(args.body.trim() === ''){
                throw new Error("Post body must not be empty")
            }
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
            const user = await checkAuth(context);
            try {
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    post.delete();
                    return "Post deleted successfully";
                }
                throw new AuthenticationError("Action not allowed");
            } catch (err) {
                throw new Error(err);
            }
        },
        likePost: async (parent, { postId }, context) => {
            const { username } = await checkAuth(context);
            const post = await Post.findById(postId);
            if (post) {
                // const likeIndex = ;
                if (post.likes.find((like) => like.username === username)) {
                    //Post already liked, unlike it
                    post.likes = post.likes.filter(
                        (like) => like.username !== username
                    );
                } else {
                    //Post not liked
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString(),
                    });
                }
                await post.save();
                return post;
            } else {
                // post does not exist
                throw new Error("Post does not exist");
            }
        },
    },
};

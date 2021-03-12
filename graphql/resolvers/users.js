const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
module.exports = {
    Mutation: {
        register: async (parent, args, context, info) => {
            let {
                username,
                password,
                confirmPassword,
                email,
            } = args.registerInput;

            // TODO: validate user data
            // TODO: user already exist

            // hash password and create auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
            });

            const res = await newUser.save();
            // TODO: make jwt sign into a promise.
            const token = jwt.sign(
                {
                    id: res.id,
                    email: res.email,
                    username: res.username,
                },
                SECRET_KEY,
                { expiresIn: "1h" }
            );
            return {
                ...res._doc,
                id: res._id,
                token,
            };
        },
    },
};

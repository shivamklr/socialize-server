const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const { validateRegisterInput } = require("../../util/validators");

module.exports = {
    Mutation: {
        register: async (parent, args) => {
            let {
                username,
                password,
                confirmPassword,
                email,
            } = args.registerInput;

            // validate user data
            const { valid, errors } = validateRegisterInput(args.registerInput);
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }
            // user already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "username is already taken",
                    },
                });
            }
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

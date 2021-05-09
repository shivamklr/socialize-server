const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");

const User = require("../../models/User");
const {
    validateRegisterInput,
    validateLoginInput,
} = require("../../util/validators");
const { createToken } = require("../../util/jwt");

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
            const token = createToken(res).catch((err) => {
                throw new Error("Error while creating token");
            });
            return {
                ...res._doc,
                id: res._id,
                token,
            };
        },
        login: async (parent, args) => {
            let { username, password } = args;
            const { errors, valid } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }
            const user = await User.findOne({ username });
            if (!user) {
                errors.general = "User not found";
                throw new UserInputError("User not found", { errors });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "Wrong credential";
                throw new UserInputError("Wrong credentials", { errors });
            }
            const token = createToken(user).catch((err) => {
                throw new Error("Error while creating token");
            });
            return {
                ...user._doc,
                id: user._id,
                token,
            };
        },
    },
};

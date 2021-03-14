const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");
// TODO: make jwt sign into a promise.
module.exports.createToken = (user) =>
    jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

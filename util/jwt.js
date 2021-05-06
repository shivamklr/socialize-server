const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
// TODO: make jwt into a promise.
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
module.exports.verifyJWT = (token)=>jwt.verify(token, SECRET_KEY)
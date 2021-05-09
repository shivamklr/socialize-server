const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || require("../config").SECRET_KEY;
module.exports.createToken = (user) => {
    return new Promise((resolve, reject) => {
        try {
            const jwtString = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                },
                SECRET_KEY,
                { expiresIn: "1h" }
            );
            resolve(jwtString);
        } catch (err) {
            reject(err);
        }
    });
};

// TODO: make jwt verify into a promise.
module.exports.verifyJWT = (token) => jwt.verify(token, SECRET_KEY);

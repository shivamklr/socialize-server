const { AuthenticationError } = require("apollo-server");
const { verifyJWT } = require("./jwt");
module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        // Bearer ....
        const token = authHeader.split("Bearer ")[1];
        if (token) {
            try {
                return verifyJWT(token).catch(()=>{throw new Error("Could not verify JWT")});
            } catch (err) {
                throw new AuthenticationError("Invalid/Expired token");
            }
        }
        throw new Error("Authentication Token must be \'Bearer [token]\'.");
    }
    throw new Error("Authorization header must be provided");
};

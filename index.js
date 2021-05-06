const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const dotenv = process.env.NODE_ENV === "production" || require("dotenv");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
});
process.env.NODE_ENV === "production"|| dotenv.config();
const MONGODB = process.env.DB_URI;
mongoose
    .connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log("mongodb connected");
        return server.listen({ port: process.env.PORT || 5000 });
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    })
    .catch((err) => console.log("Error while creating the server"));

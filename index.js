const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const MONGODB = process.env.DB_URI||require("./config").MONGODB;

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
});
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

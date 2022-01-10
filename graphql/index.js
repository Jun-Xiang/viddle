const { makeExecutableSchema } = require("@graphql-tools/schema");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { authDirectiveTransformer } = require("./directives/auth");

module.exports = makeExecutableSchema({
	typeDefs,
	resolvers,
	schemaTransforms: [authDirectiveTransformer],
});

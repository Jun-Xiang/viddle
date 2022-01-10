const { makeExecutableSchema } = require("@graphql-tools/schema");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { authDirectiveTransformer } = require("./directives/auth");

const transforms = [authDirectiveTransformer];
const schema = transforms.reduce(
	(acc, cur) => cur(acc, "auth"),
	makeExecutableSchema({
		typeDefs,
		resolvers,
	})
);
module.exports = schema;

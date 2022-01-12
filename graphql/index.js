const { makeExecutableSchema } = require("@graphql-tools/schema");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { authDirectiveTransformer } = require("./directives/auth");

const transforms = [{ transform: authDirectiveTransformer, name: "auth" }];
const schema = transforms.reduce(
	(acc, cur) => cur.transform(acc, cur.name),
	makeExecutableSchema({
		typeDefs,
		resolvers,
	})
);
module.exports = schema;

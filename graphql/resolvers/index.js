const { GraphQLUpload } = require("graphql-upload");
const auth = require("./auth");
const video = require("./video");
const comment = require("./comment");
const user = require("./user");
const message = require("./message");

module.exports = {
	Upload: GraphQLUpload,
	Query: {
		...auth.query,
		...video.query,
		...comment.query,
		...user.query,
		...message.query,
	},
	Mutation: {
		...auth.mutation,
		...video.mutation,
		...comment.mutation,
		...user.mutation,
		...message.mutation,
	},
	Subscription: {
		...message.subscription,
	},
};

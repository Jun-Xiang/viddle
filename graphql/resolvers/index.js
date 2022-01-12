const { GraphQLUpload } = require("graphql-upload");
const auth = require("./auth");
const video = require("./video");
const comment = require("./comment");
const user = require("./user");

module.exports = {
	Upload: GraphQLUpload,
	Query: {
		...auth.query,
		...video.query,
		...comment.query,
		...user.query,
	},
	Mutation: {
		...auth.mutation,
		...video.mutation,
		...comment.mutation,
		...user.mutation,
	},
};

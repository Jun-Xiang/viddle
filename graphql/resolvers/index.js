const { GraphQLUpload } = require("graphql-upload");
const auth = require("./auth");
const video = require("./video");
const comment = require("./comment");

module.exports = {
	Upload: GraphQLUpload,
	Query: {
		...auth.query,
		...video.query,
		...comment.query,
	},
	Mutation: {
		...auth.mutation,
		...video.mutation,
		...comment.mutation,
	},
};

const { gql } = require("apollo-server-express");

module.exports = gql`
	type Comment {
		id: ID
		comment: String
		user: User
		createdAt: String
	}
	extend type Query {
		getComments(videoId: ID): [Comment]
	}

	extend type Mutation {
		addComment(videoId: ID, comment: String): Comment @auth
		updateComment(id: ID, comment: String): Comment @auth
		deleteComment(id: ID): Comment @auth
	}
`;

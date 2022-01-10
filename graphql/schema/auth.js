const { gql } = require("apollo-server-express");

module.exports = gql`
	type User {
		username: String
		email: String
		profilePic: String
		bannerPic: String
	}

	extend type Query {
		getMe: User @auth
	}

	extend type Mutation {
		login(token: String): String
	}
`;

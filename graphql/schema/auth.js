const { gql } = require("apollo-server-express");

module.exports = gql`
	type User {
		id: ID
		username: String
		email: String
		profilePic: String
		bannerPic: String
	}

	extend type Mutation {
		login(token: String): String
	}
`;

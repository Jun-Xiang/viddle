const { gql } = require("apollo-server-express");

module.exports = gql`
	type User {
		id: ID
		username: String
		email: String
		profilePic: String
		bannerPic: String
		subscribers: Int
		subscribings: [ID]
		isLive: Boolean
	}

	input UserInput {
		username: String
		bannerFile: Upload
		profileFile: Upload
	}

	extend type Query {
		getMe: User @auth
		getUser(id: ID): User
	}

	extend type Mutation {
		updateUser(user: UserInput): User @auth
		deleteUser: User @auth
		subscribe(userId: ID): User @auth
		unsubscribe(userId: ID): User @auth
		updateLiveStatus(isLive: Boolean): User @auth
	}
`;

const { gql } = require("apollo-server-express");

module.exports = gql`
	type Message {
		id: ID
		# id of the live chat
		roomId: ID
		message: String
		sender: User
	}

	input MessageInput {
		roomId: ID
		message: String
	}

	extend type Mutation {
		addMessage(message: MessageInput): Message
	}

	extend type Subscription {
		messageCreated(roomId: ID): Message
	}
`;

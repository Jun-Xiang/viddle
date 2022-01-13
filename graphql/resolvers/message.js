const { withFilter } = require("graphql-subscriptions");
const { addMessage } = require("../../db/Message");

module.exports = {
	query: {},
	mutation: {
		addMessage: async (_, { message }, ctx) => {
			ctx.pubsub.publish("NEW_MESSAGE", {
				messageCreated: message,
			});
			return await addMessage(
				message.roomId,
				message.message,
				ctx.user.id
			);
		},
	},
	subscription: {
		messageCreated: {
			subscribe: withFilter(
				(_, __, ctx) => ctx.pubsub.asyncIterator(["NEW_MESSAGE"]),
				// * Assume that client url will be '/live/${roomId}' where roomId is the userId of the current live user
				(payload, variables) =>
					payload.messageCreated.roomId === variables.roomId
			),
		},
	},
};

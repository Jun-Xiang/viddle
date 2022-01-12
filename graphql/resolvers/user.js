const { ApolloError } = require("apollo-server-express");
const {
	getUserById,
	updateUser,
	subscribe,
	unsubscribe,
	deleteUser,
} = require("../../db/User");

module.exports = {
	query: {
		getMe: async (_, __, ctx) => {
			const { user: ctxUser } = ctx;
			const user = await getUserById(ctxUser.id);
			if (!user) {
				throw new ApolloError("User not found", "BAD_USER_INPUT");
			}
			console.log(user);
			return user;
		},
		getUser: async (_, { id }) => await getUserById(id),
	},
	mutation: {
		updateUser: async (_, { user }, ctx) =>
			await updateUser(ctx.user.id, user),

		deleteUser: async (_, __, ctx) => await deleteUser(ctx.user.id),

		subscribe: async (_, { userId }, ctx) =>
			await subscribe(userId, ctx.user.id),

		unsubscribe: async (_, { userId }, ctx) =>
			await unsubscribe(userId, ctx.user.id),
	},
};

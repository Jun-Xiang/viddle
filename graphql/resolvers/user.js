const { ApolloError } = require("apollo-server-express");
const { getUserById } = require("../../db/User");

module.exports = {
	query: {
		getMe: async (_, __, ctx) => {
			const { user: ctxUser } = ctx;
			const user = await getUserById(ctxUser.id);
			if (!user) {
				throw new ApolloError("User not found", "BAD_USER_INPUT");
			}
			return user;
		},
	},
};

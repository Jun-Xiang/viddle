const { getUser, createUser } = require("../../db/User");
const {
	verifyGoogleAuthToken,
	createAccessToken,
} = require("../../utils/auth");

module.exports = {
	query: {},
	mutation: {
		login: async (_, { token }) => {
			const payload = await verifyGoogleAuthToken(token);
			const foundUser = await getUser({ email: payload.email });
			if (foundUser) {
				return createAccessToken(foundUser);
			}

			const newUser = await createUser({
				email: payload.email,
				username: payload.name,
				profilePic: payload.picture,
			});
			return createAccessToken(newUser);
		},
	},
};

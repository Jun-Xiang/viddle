const { ApolloError } = require("apollo-server-express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const { getUserById, getUser, createUser } = require("../../db/User");
const {
	verifyGoogleAuthToken,
	createAccessToken,
} = require("../../utils/auth");

module.exports = {
	query: {
		getMe: async (_, __, ctx) => {
			const { user: ctxUser } = ctx;
			try {
				const user = await getUserById(ctxUser.id);
				if (!user) {
					throw new ApolloError("User not found", "BAD_USER_INPUT");
				}
				return user;
			} catch (err) {
				throw new ApolloError("Something went wrong");
			}
		},
	},
	mutation: {
		login: async (_, { token }) => {
			try {
				const payload = await verifyGoogleAuthToken(token);
				const foundUser = await getUser({ email: payload.email });
				if (foundUser) {
					return createAccessToken(foundUser);
				}
				const image = await axios.get(payload.picture, {
					responseType: "arraybuffer",
				});
				const base64 = Buffer.from(image.data, "binary").toString(
					"base64"
				);
				const filename = Date.now() + payload.sub + ".png";
				fs.writeFileSync(
					path.join(__dirname, "../../public", filename),
					base64,
					"base64"
				);

				const createdUser = await createUser({
					email: payload.email,
					username: payload.name,
					profilePic: filename,
				});
				return createAccessToken(createdUser);
			} catch (err) {
				throw new ApolloError("Something went wrong");
			}
		},
	},
};

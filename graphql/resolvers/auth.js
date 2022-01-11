const axios = require("axios");
const fs = require("fs");
const path = require("path");

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
			const image = await axios.get(payload.picture, {
				responseType: "arraybuffer",
			});
			const base64 = Buffer.from(image.data, "binary").toString("base64");
			const filename = Date.now() + payload.sub + ".png";
			fs.writeFileSync(
				path.join(__dirname, "../../public", filename),
				base64,
				"base64"
			);

			const newUser = await createUser({
				email: payload.email,
				username: payload.name,
				profilePic: filename,
			});
			return createAccessToken(newUser);
		},
	},
};

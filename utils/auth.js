const { ApolloError } = require("apollo-server-express");
const client = require("../config/google-auth");
const jwt = require("jsonwebtoken");

const verifyGoogleAuthToken = async token => {
	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});
		const payload = ticket.getPayload();
		return payload;
	} catch (err) {
		console.error(err);
		throw new ApolloError("Something went wrong");
	}
};

const createAccessToken = user => {
	const payload = {
		id: user.id,
		username: user.username,
		profilePic: user.profilePic,
		email: user.email,
	};
	return jwt.sign(payload, process.env.AT_SECRET, { expiresIn: "7h" });
};

module.exports = {
	verifyGoogleAuthToken,
	createAccessToken,
};

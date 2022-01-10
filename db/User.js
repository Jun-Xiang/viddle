const { ApolloError } = require("apollo-server-express");
const UserModel = require("../models/User");

const getUserById = async id => {
	try {
		const user = await UserModel.findById(id);
		return user;
	} catch (err) {
		throw new ApolloError("Something went wrong");
	}
};

const getUser = async query => {
	try {
		const user = await UserModel.findOne(query);
		return user;
	} catch (err) {
		throw new ApolloError("Something went wrong");
	}
};

const createUser = async ({ username, email, profilePic }) => {
	try {
		const createdUser = await UserModel.create({
			username,
			email,
			profilePic,
		});
		return createdUser;
	} catch (err) {
		throw new ApolloError("Something went wrong");
	}
};

module.exports = {
	getUserById,
	getUser,
	createUser,
};

const UserModel = require("../models/User");

const getUserById = async id => {
	const user = await UserModel.findById(id);
	return user;
};

const getUser = async query => {
	const user = await UserModel.findOne(query);
	return user;
};

const createUser = async ({ username, email, profilePic }) => {
	const newUser = await UserModel.create({
		username,
		email,
		profilePic,
	});
	return newUser;
};

module.exports = {
	getUserById,
	getUser,
	createUser,
};

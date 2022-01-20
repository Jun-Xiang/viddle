const UserModel = require("../models/User");

const {
	isAssetFromCloudinary,
	removeFile,
	fileImageUpload,
	deleteFolder,
} = require("../utils/cloudinary");

const { getBufferFromStream, getSubscribersCount } = require("../utils/user");

const getUserById = async id => {
	const user = await UserModel.findById(id).lean();
	return getSubscribersCount(user);
};

const getUser = async query => {
	let user = await UserModel.findOne(query).lean();
	if (user) {
		user = getSubscribersCount(user);
	}
	return user;
};

const createUser = async ({ username, email, profilePic }) => {
	const newUser = await UserModel.create({
		username,
		email,
		profilePic,
	}).then(doc => doc.toObject());

	return getSubscribersCount(newUser);
};

const updateUser = async (userId, { username, bannerFile, profileFile }) => {
	const user = await UserModel.findById(userId);

	const upload = async file => {
		const { createReadStream } = await file;
		const stream = createReadStream();
		// Should use upload_stream but i wan use other stuff :)
		const buffer = await getBufferFromStream(stream);
		const data = "data:image/png;base64," + buffer.toString("base64");
		const result = await fileImageUpload(data, userId);
		return result;
	};

	if (bannerFile) {
		const result = await upload(bannerFile);
		user.bannerPic = result.url;
	}
	if (profileFile) {
		if (isAssetFromCloudinary(user.profilePic))
			await removeFile(user.profilePic, user.id);
		const result = await upload(profileFile);
		user.profilePic = result.url;
	}
	user.username = username;
	const doc = await user.save();

	return getSubscribersCount(doc.toObject());
};

const deleteUser = async userId => {
	await deleteFolder(userId);
	const user = await UserModel.deleteOne({ _id: userId });
	return user;
};

const subscribe = async (userId, curUserId) => {
	const channelOwner = await UserModel.findById(userId);
	const subscriber = await UserModel.findById(curUserId);
	if (userId === curUserId || channelOwner.subscribers.includes(curUserId)) {
		return getSubscribersCount(subscriber.toObject());
	}

	channelOwner.subscribers.push(curUserId);
	subscriber.subscribings.push(userId);
	await channelOwner.save();
	const subscriberDoc = await subscriber.save();

	// * return myself
	return getSubscribersCount(subscriberDoc.toObject());
};

const unsubscribe = async (userId, curUserId) => {
	const channelOwner = await UserModel.findByIdAndUpdate(
		userId,
		{
			$pull: { subscribers: curUserId },
		},
		{ new: true }
	);
	const subscriber = await UserModel.findByIdAndUpdate(
		curUserId,
		{
			$pull: { subscribings: userId },
		},
		{
			new: true,
		}
	).lean();
	return getSubscribersCount(subscriber);
};

module.exports = {
	getUserById,
	getUser,
	createUser,
	updateUser,
	deleteUser,
	subscribe,
	unsubscribe,
};

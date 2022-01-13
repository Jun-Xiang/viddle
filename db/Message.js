const MessageModel = require("../models/Message");

const addMessage = async (roomId, message, sender) => {
	const newMessage = await MessageModel.create({
		roomId,
		message,
		sender,
	});
	await newMessage.populate("sender");
	return newMessage;
};

module.exports = {
	addMessage,
};

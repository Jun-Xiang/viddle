const MessageModel = require("../models/Message");

const addMessage = async (roomId, message, sender) => {
	const newMessage = await MessageModel.create({
		roomId,
		message,
		sender,
	});
	// Should store the user and just return the userId but i guess this should work
	await newMessage.populate("sender");
	return newMessage;
};

module.exports = {
	addMessage,
};

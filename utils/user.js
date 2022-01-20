const getBufferFromStream = stream =>
	new Promise((res, rej) => {
		const chunks = [];
		stream.on("data", chunk => chunks.push(chunk));
		stream.on("end", _ => res(Buffer.concat(chunks)));
		stream.on("error", rej);
	});

const getSubscribersCount = user => {
	user.id = user._id;
	user.subscribers = user.subscribers.length;
	return user;
};

module.exports = {
	getBufferFromStream,
	getSubscribersCount,
};

const getBufferFromStream = stream =>
	new Promise((res, rej) => {
		const chunks = [];
		stream.on("data", chunk => chunks.push(chunk));
		stream.on("end", _ => res(Buffer.concat(chunks)));
		stream.on("error", rej);
	});

module.exports = {
	getBufferFromStream,
};

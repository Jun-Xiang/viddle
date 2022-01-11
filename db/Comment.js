const CommentModel = require("../models/Comment");

// do pagination if got time
const getComments = async videoId => {
	const comments = await CommentModel.find({
		video: videoId,
	})
		.sort({ createdAt: -1 })
		.populate("user");
	return comments;
};

const addComment = async (videoId, userId, comment) => {
	const newComment = await CommentModel.create({
		video: videoId,
		comment,
		user: userId,
	});
	await newComment.populate("user");
	return newComment;
};

const updateComment = async (id, comment) => {
	const updatedComment = await CommentModel.findByIdAndUpdate(
		id,
		{
			comment,
		},
		{ new: true }
	).populate("user");

	return updatedComment;
};

const deleteComment = async id => {
	const deletedComment = await CommentModel.findByIdAndDelete(id);
	return deletedComment;
};

module.exports = {
	getComments,
	addComment,
	updateComment,
	deleteComment,
};

const {
	addComment,
	getComments,
	updateComment,
	deleteComment,
} = require("../../db/Comment");

module.exports = {
	query: {
		getComments: async (_, { videoId }) => {
			const comments = await getComments(videoId);
			console.log(comments[0].id);
			return comments;
		},
	},
	mutation: {
		addComment: async (_, { videoId, comment }, ctx) => {
			const newComment = await addComment(videoId, ctx.user.id, comment);
			return newComment;
		},
		updateComment: async (_, { id, comment }) => {
			const newComment = await updateComment(id, comment);
			return newComment;
		},
		deleteComment: async (_, { id }) => {
			const deletedComment = await deleteComment(id);
			return deletedComment;
		},
	},
};

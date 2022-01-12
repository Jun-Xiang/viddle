const {
	addComment,
	getComments,
	updateComment,
	deleteComment,
} = require("../../db/Comment");

module.exports = {
	query: {
		getComments: async (_, { videoId }) => await getComments(videoId),
	},
	mutation: {
		addComment: async (_, { videoId, comment }, ctx) =>
			await addComment(videoId, ctx.user.id, comment),

		updateComment: async (_, { id, comment }) =>
			await updateComment(id, comment),

		deleteComment: async (_, { id }) => await deleteComment(id),
	},
};

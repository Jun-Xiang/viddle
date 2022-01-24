const {
	getVideoById,
	getVideos,
	getUserVideos,
	getLiveVideos,
	getLikeVideos,
	createVideo,
	updateVideo,
	deleteVideo,
	incrementViews,
	addLikes,
	removeFromLikes,
	addDislikes,
	removeFromDislikes,
	searchVideos,
	getSubscribingsVideos,
} = require("../../db/Video");

module.exports = {
	query: {
		getVideo: async (_, { id }) => await getVideoById(id),
		getVideos: async (_, { offset = 0, next = 10 }) =>
			await getVideos(offset, next),
		getUserVideos: async (_, __, ctx) => await getUserVideos(ctx.user.id),
		searchVideos: async (_, { searchTerm }) =>
			await searchVideos(searchTerm),
		getSubscribingsVideos: async (_, { offset = 0, next = 10 }, ctx) =>
			await getSubscribingsVideos(offset, next, ctx.user.id),
		getLiveVideos: async () => await getLiveVideos(),
		getLikeVideos: async (_, __, ctx) => await getLikeVideos(ctx.user.id),
		// Do like videos
	},
	mutation: {
		addVideo: async (_, { video }, ctx) =>
			await createVideo(video, ctx.user.id),

		updateVideo: async (_, { id, video }) => await updateVideo(id, video),

		deleteVideo: async (_, { id }) => await deleteVideo(id),

		incrementViews: async (_, { id }) => await incrementViews(id),

		likeVideo: async (_, { id }, ctx) => await addLikes(id, ctx.user.id),

		unlikeVideo: async (_, { id }, ctx) =>
			await removeFromLikes(id, ctx.user.id),

		dislikeVideo: async (_, { id }, ctx) =>
			await addDislikes(id, ctx.user.id),

		undislikeVideo: async (_, { id }, ctx) =>
			await removeFromDislikes(id, ctx.user.id),
	},
};

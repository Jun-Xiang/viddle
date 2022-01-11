const {
	getVideoById,
	getVideos,
	createVideo,
	incrementViews,
	addLikes,
	removeFromLikes,
	addDislikes,
	removeFromDislikes,
} = require("../../db/Video");

module.exports = {
	query: {
		getVideo: async (_, { id }) => {
			const video = await getVideoById(id);
			return video;
		},
		getVideos: async (_, { offset = 0, next = 10 }) => {
			const video = await getVideos(offset, next);
			return video;
		},
	},
	mutation: {
		addVideo: async (_, { video }, ctx) => {
			const newVideo = await createVideo(video, ctx.user.id);
			return newVideo;
		},
		incrementViews: async (_, { id }) => {
			const updatedVideo = await incrementViews(id);
			return updatedVideo;
		},
		likeVideo: async (_, { id }, ctx) => {
			const updatedVideo = await addLikes(id, ctx.user.id);
			return updatedVideo;
		},
		unlikeVideo: async (_, { id }, ctx) => {
			const updatedVideo = await removeFromLikes(id, ctx.user.id);
			return updatedVideo;
		},
		dislikeVideo: async (_, { id }, ctx) => {
			const updatedVideo = await addDislikes(id, ctx.user.id);
			return updatedVideo;
		},
		undislikeVideo: async (_, { id }, ctx) => {
			const updatedVideo = await removeFromDislikes(id, ctx.user.id);
			return updatedVideo;
		},
	},
};

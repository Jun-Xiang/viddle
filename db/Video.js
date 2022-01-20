const UserModel = require("../models/User");
const VideoModel = require("../models/Video");
const { streamVideoUpload, removeFile } = require("../utils/cloudinary");
const { getSubscribersCount } = require("../utils/user");

// Helpers
const handleVideoInput = async (video, authorId) => {
	let { file, title, description, url } = video;
	if (file && !url) {
		const { createReadStream } = await file;
		const readable = createReadStream();
		const result = await streamVideoUpload(readable, authorId);

		url = result.url;
	}
	return { title, description, url };
};

//

const getVideoById = async id => {
	const video = await VideoModel.findById(id).populate("author").lean();
	video.author = getSubscribersCount(video.author);
	video.id = video._id;
	return video;
};

const getVideos = async (offset, next, userId) => {
	const videos = await VideoModel.find({})
		.sort({ createdAt: -1 })
		.skip(Number(offset))
		.limit(Number(next))
		.populate("author")
		.lean();

	return videos.map(
		v => (v.author = getSubscribersCount(v.author)),
		(v.id = v._id)
	);
};

const getSubscribingsVideos = async (offset, next, userId) => {
	const user = await UserModel.findById(userId);

	const videos = await VideoModel.find({
		author: { $in: user.subscribings },
	})
		.sort({ createdAt: -1 })
		.skip(Number(offset))
		.limit(Number(next))
		.populate("author");
	return videos;
};

const createVideo = async (video, authorId) => {
	const { title, description, url } = await handleVideoInput(video, authorId);
	const newVideo = await VideoModel.create({
		title,
		description,
		url,
		author: authorId,
	});
	await newVideo.populate("author");

	return newVideo;
};

const updateVideo = async (id, video) => {
	const { title, description, url } = await handleVideoInput(video);
	const updatedVideo = await VideoModel.findByIdAndUpdate(
		id,
		{
			title,
			description,
			url,
		},
		{
			new: true,
		}
	).populate("author");
	return updatedVideo;
};

const deleteVideo = async id => {
	const deletedVideo = await VideoModel.findByIdAndDelete(id).populate(
		"author"
	);

	await removeFile(deletedVideo.url, deletedVideo.author.id);
	return deletedVideo;
};

const deleteVideosByUser = async userId => {
	const deletedVideos = await VideoModel.findOneAndDelete({
		author: userId,
	});
	return deletedVideos;
};
const incrementViews = async id => {
	const updatedVideo = await VideoModel.findByIdAndUpdate(
		id,
		{
			$inc: { views: 1 },
		},
		{ new: true }
	).populate("author");
	return updatedVideo;
};

const addLikes = async (id, userId) => {
	await removeFromDislikes(id, userId);
	await removeFromLikes(id, userId);
	const updatedVideo = await VideoModel.findByIdAndUpdate(
		id,
		{
			$push: { likes: userId },
		},
		{ new: true }
	).populate("author");

	return updatedVideo;
};
const removeFromLikes = async (id, userId) => {
	const updatedVideo = await VideoModel.findByIdAndUpdate(
		id,
		{
			$pull: { likes: userId },
		},
		{ new: true }
	).populate("author");

	return updatedVideo;
};

const addDislikes = async (id, userId) => {
	await removeFromLikes(id, userId);
	await removeFromDislikes(id, userId);
	const updatedVideo = await VideoModel.findByIdAndUpdate(
		id,
		{
			$push: { dislikes: userId },
		},
		{ new: true }
	).populate("author");

	return updatedVideo;
};

const removeFromDislikes = async (id, userId) => {
	const updatedVideo = await VideoModel.findByIdAndUpdate(
		id,
		{
			$pull: { dislikes: userId },
		},
		{ new: true }
	).populate("author");

	return updatedVideo;
};

module.exports = {
	getVideoById,
	getVideos,
	getSubscribingsVideos,
	createVideo,
	updateVideo,
	deleteVideo,
	deleteVideosByUser,
	incrementViews,
	addLikes,
	removeFromLikes,
	addDislikes,
	removeFromDislikes,
};

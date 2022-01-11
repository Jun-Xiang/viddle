const UserModel = require("../models/User");
const VideoModel = require("../models/Video");
const cloudinary = require("../config/cloudinary");

const getVideoById = async id => {
	const video = await VideoModel.findById(id).populate("author");

	return video;
};

const getVideos = async (offset, next, userId) => {
	const videos = await VideoModel.find({})
		.sort({ createdAt: -1 })
		.skip(Number(offset))
		.limit(Number(next))
		.populate("author");
	return videos;
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
	const streamUpload = stream =>
		new Promise((res, rej) => {
			const cldUploadStream = cloudinary.uploader.upload_stream(
				{
					resource_type: "video",
				},
				(err, result) => {
					if (result) return res(result);
					else rej(err);
				}
			);
			stream.pipe(cldUploadStream);
		});

	let { file, title, description, url } = video;
	if (!url) {
		const { createReadStream } = await file;
		const readable = createReadStream();
		const result = await streamUpload(readable);

		url = result.url;
	}

	const newVideo = await VideoModel.create({
		title,
		description,
		url,
		author: authorId,
	});
	return newVideo;
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
	incrementViews,
	addLikes,
	removeFromLikes,
	addDislikes,
	removeFromDislikes,
};

const cloudinary = require("../config/cloudinary");

const isAssetFromCloudinary = url => url.includes("cloudinary");
const getPublicId = url => {
	const last = url.split("/").pop();
	return last.split(".")[0];
};

const streamVideoUpload = (stream, userId) =>
	new Promise((res, rej) => {
		const cldUploadStream = cloudinary.uploader.upload_stream(
			{
				resource_type: "video",
				folder: userId,
			},
			(err, result) => {
				if (result) return res(result);
				else rej(err);
			}
		);
		stream.pipe(cldUploadStream);
	});

const fileImageUpload = (data, userId) =>
	new Promise((res, rej) => {
		cloudinary.uploader.upload(
			data,
			{
				folder: userId,
			},
			(err, result) => {
				if (result) res(result);
				else rej(err);
			}
		);
	});

const pathUpload = (path, userId) =>
	new Promise((res, rej) => {
		cloudinary.uploader.upload(
			path,
			{
				folder: userId,
				resource_type: "video",
			},
			(err, result) => {
				if (result) res(result);
				else rej(err);
			}
		);
	});

const removeFile = (url, userId) => {
	const publicId = getPublicId(url);
	return new Promise((res, rej) => {
		cloudinary.uploader.destroy(
			`${userId}/${publicId}`,
			{ resource_type: "video" },
			(err, result) => {
				if (result) res(result);
				else rej(err);
			}
		);
	});
};
/**
 * Methods for removing a user's assets
 */

const removeImagesInFolder = userId =>
	new Promise((res, rej) => {
		cloudinary.api.delete_resources_by_prefix(userId, (err, result) => {
			if (result) res(result);
			else rej(err);
		});
	});

const removeVideosInFolder = userId =>
	new Promise((res, rej) => {
		cloudinary.api.delete_resources_by_prefix(
			userId,
			{ resource_type: "video" },
			(err, result) => {
				if (result) res(result);
				else rej(err);
			}
		);
	});

const removeFolder = userId =>
	new Promise((res, rej) => {
		cloudinary.api.delete_folder(userId, (err, result) => {
			if (result) res(result);
			else rej(err);
		});
	});

const deleteFolder = async userId => {
	await removeImagesInFolder(userId);
	await removeVideosInFolder(userId);
	await removeFolder(userId);
};

module.exports = {
	isAssetFromCloudinary,
	streamVideoUpload,
	fileImageUpload,
	removeFile,
	deleteFolder,
	pathUpload,
};

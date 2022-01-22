const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema(
	{
		title: {
			type: String,
		},
		description: {
			type: String,
		},
		url: {
			type: String,
		},
		category: {
			type: String,
		},
		author: {
			type: mongoose.Types.ObjectId,
			ref: "User",
		},
		likes: {
			type: Array,
			default: [],
		},
		dislikes: {
			type: Array,
			default: [],
		},
		views: {
			type: Number,
			default: 0,
		},
		type: {
			type: String,
			default: "video",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Video", VideoSchema);

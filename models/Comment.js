const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
	{
		video: {
			type: mongoose.Types.ObjectId,
		},
		comment: {
			type: String,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Comment", CommentSchema);

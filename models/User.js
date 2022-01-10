const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	profilePic: {
		type: String,
	},
	bannerPic: {
		type: String,
	},
	subscribers: {
		type: Array,
		default: [],
	},
	subscribings: {
		type: Array,
		default: [],
	},
});

module.exports = mongoose.model("User", UserSchema);

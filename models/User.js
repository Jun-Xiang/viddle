const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { deleteVideosByUser } = require("../db/Video");

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

UserSchema.post("deleteOne", async function (res, next) {
	const user = this;
	const id = user.getFilter()._id.toString();
	await deleteVideosByUser(id);
	await User.updateMany(
		{
			subscribers: id,
		},
		{
			$pull: { subscribers: id },
		},
		{ new: true }
	);
	next();
});
const User = mongoose.model("User", UserSchema);

module.exports = User;

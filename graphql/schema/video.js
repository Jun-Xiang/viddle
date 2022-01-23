const { gql } = require("apollo-server-express");

module.exports = gql`
	input VideoInput {
		file: Upload
		title: String!
		description: String!
		type: String
		url: String
	}

	type Video {
		id: ID
		url: String
		title: String
		description: String
		category: String
		author: User
		likes: [ID]
		dislikes: [ID]
		views: Int
		createdAt: String
	}

	extend type Query {
		getVideo(id: ID): Video
		getVideos(offset: Int, next: Int): [Video]
		getUserVideos: [Video]
		searchVideos(searchTerm: String): [Video]
	}

	extend type Mutation {
		addVideo(video: VideoInput): Video @auth
		updateVideo(id: ID, video: VideoInput): Video @auth
		deleteVideo(id: ID): Video @auth

		incrementViews(id: ID): Video
		likeVideo(id: ID): Video @auth
		unlikeVideo(id: ID): Video @auth
		dislikeVideo(id: ID): Video @auth
		undislikeVideo(id: ID): Video @auth
	}
`;

require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const schema = require("./graphql");

const PORT = process.env.PORT || 4000;

async function startApolloServer(schema) {
	const app = express();
	const server = new ApolloServer({
		schema,
	});
	await server.start();
	await mongoose.connect(
		process.env.MONGODB_URL,
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
		},
		_ => console.log("Connected to mongodb 🎉")
	);

	app.use(express.static("/public"));
	server.applyMiddleware({ app, cors: true, path: "/graphql" });
	app.listen(PORT, _ => console.log("Server started 🚀"));
}

startApolloServer(schema);

require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const { graphqlUploadExpress } = require("graphql-upload");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { createServer } = require("http");

const schema = require("./graphql");

const pubsub = require("./config/pubsub");
const { verifyAccessToken } = require("./utils/auth");

const PORT = process.env.PORT || 4000;

async function startApolloServer(schema) {
	const app = express();
	const httpServer = createServer(app);
	const subscriptionServer = SubscriptionServer.create(
		{
			schema,
			execute,
			subscribe,
			async onConnect(connectionParams, webSocket) {
				if (connectionParams.authorization) {
					const payload = verifyAccessToken(
						connectionParams.authorization
					);
					return {
						user: payload,
						pubsub,
					};
				}
				throw new Error("Missing authorization token");
			},
		},
		{
			server: httpServer,
			path: "/graphql",
		}
	);

	const server = new ApolloServer({
		schema,
		plugins: [
			{
				async serverWillStart() {
					return {
						async drainServer() {
							subscriptionServer.close();
						},
					};
				},
			},
		],
		context: ({ req, res }) => {
			const token = req.headers.authorization || "";
			const payload = verifyAccessToken(token) || null;
			return {
				req,
				res,
				pubsub,
				user: payload,
			};
		},
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
	app.use(graphqlUploadExpress());
	server.applyMiddleware({ app, cors: true, path: "/graphql" });
	httpServer.listen(PORT, _ => console.log("Server started 🚀"));
}

startApolloServer(schema);

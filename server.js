require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const { graphqlUploadExpress } = require("graphql-upload");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { createServer } = require("http");
const WebSocket = require("ws");
const fs = require("fs");

const { pathUpload } = require("./utils/cloudinary");
const VideoModel = require("./models/Video");
const UserModel = require("./models/User");

const schema = require("./graphql");

const pubsub = require("./config/pubsub");
const { verifyAccessToken } = require("./utils/auth");

const PORT = process.env.PORT || 4000;

async function startApolloServer(schema) {
	const app = express();
	const wss = new WebSocket.Server({ port: "5000" });
	const clients = {};
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
	// Websocket for livestream
	wss.on("connection", (ws, req) => {
		// turn /uniqueid?initiator=true&token=hello => uniqueid
		const id = req.url.split("?")[0].slice(1);
		const query = new URLSearchParams(req.url.split("?")[1]);
		const isInitiating = query.get("initiator") === "true";
		const token = query.get("token");
		console.log(req.url);
		console.log(isInitiating, token, id);
		console.log(req.headers);
		let fileStream;
		if (isInitiating) {
			const filename = `${Date.now() + id}.webm`;
			fileStream = fs
				.createWriteStream(filename, {
					flags: "a",
				})
				.on("close", async _ => {
					const result = await pathUpload(filename, id);
					await VideoModel.findOneAndUpdate(
						{
							author: id,
							type: "live",
						},
						{
							url: result.url,
						},
						{
							sort: { createdAt: -1 },
						}
					);
					fs.unlinkSync(filename);
				});
		} else {
			if (clients[id]) clients[id].push(ws);
			else clients[id] = [ws];
		}

		ws.on("message", msg => {
			clients[id].forEach(ws => {
				ws.send(msg);
			});
			fileStream.write(msg);
		});
		ws.on("close", _ => {
			fileStream?.end();
		});
	});

	server.applyMiddleware({ app, cors: true, path: "/graphql" });
	httpServer.listen(PORT, _ => console.log("Server started 🚀"));
}

startApolloServer(schema);

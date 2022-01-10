const auth = require("./auth");

module.exports = {
	Query: {
		...auth.query,
	},
	Mutation: {
		...auth.mutation,
	},
};

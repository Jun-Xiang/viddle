const { gql } = require("apollo-server-express");

module.exports = gql`
	directive @auth on FIELD_DEFINITION
	scalar Upload
	type Query
	type Mutation
	type Subscription
`;

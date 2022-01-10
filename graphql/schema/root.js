const { gql } = require("apollo-server-express");

module.exports = gql`
	directive @auth on FIELD_DEFINITION
	type Query

	type Mutation
`;

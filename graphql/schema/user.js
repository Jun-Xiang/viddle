const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    getMe: User @auth
  }

  extend type Mutation {
  
  }
`;

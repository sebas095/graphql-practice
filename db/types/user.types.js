const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    email: String!
    hashedPassword: String
    token: String
    courses: [Course]
  }

  extend type Query {
    getUsers: [User]
    getUser(id: ID!): User
  }

  input UserInput {
    email: String
    password: String
  }

  extend type Mutation {
    signUp(input: UserInput): User
    logIn(input: UserInput): User
  }
`;

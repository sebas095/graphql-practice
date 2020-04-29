const { gql } = require("apollo-server-express");

module.exports = gql`
  type Course {
    id: ID!
    title: String!
    views: Int
    user: User
  }

  input CourseInput {
    title: String
    views: Int
  }

  extend type Query {
    getCourses(page: Int, limit: Int = 1): [Course]
    getCourse(id: ID!): Course
  }

  extend type Mutation {
    addCourse(input: CourseInput, user_id: ID!): Course
    updateCourse(id: ID!, input: CourseInput): Course
    deleteCourse(id: ID!): Alert
  }
`;

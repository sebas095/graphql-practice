const express = require("express");
const { buildSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");

const courses = require("./data/courses");

const app = express();

// * Schema definition languaje
const schema = buildSchema(`
  type Course {
    id: ID!
    title: String!
    views: Int
  }

  type Query {
    getCourses: [Course]
    getCourse(id: ID!): Course
  }
`);

const root = {
  getCourses() {
    return courses;
  },
  getCourse({ id }) {
    return courses.find((course) => course.id === id);
  },
};

app.get("/", (req, res) => {
  res.json(courses);
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(8080, () => {
  console.log("Server started in localhost:8080");
});

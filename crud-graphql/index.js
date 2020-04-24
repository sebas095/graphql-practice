const express = require("express");
const { buildSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");

let courses = require("./data/courses");

const app = express();

// * Schema definition languaje
const schema = buildSchema(`
  type Course {
    id: ID!
    title: String!
    views: Int
  }

  type Alert {
    message: String
  }

  input CourseInput {
    title: String!
    views: Int
  }

  type Query {
    getCourses(page: Int, limit: Int = 1): [Course]
    getCourse(id: ID!): Course
  }

  type Mutation {
    addCourse(input: CourseInput): Course
    updateCourse(id: ID!, input: CourseInput): Course
    deleteCourse(id: ID!): Alert
  }
`);

const root = {
  getCourses({ page, limit }) {
    if (page !== undefined) {
      return courses.slice((page - 1) * limit, page * limit);
    }
    return courses;
  },

  getCourse({ id }) {
    return courses.find((course) => course.id === id);
  },

  addCourse({ input: { title, views } }) {
    const id = String(courses.length + 1);
    const course = { id, title, views };
    courses.push(course);

    return course;
  },

  updateCourse({ id, input: { title, views } }) {
    const index = courses.findIndex((course) => course.id === id);
    const course = courses[index];

    let newCourse = views ? { ...course, title, views } : { ...course, title };
    courses[index] = newCourse;

    return newCourse;
  },

  deleteCourse({ id }) {
    courses = courses.filter((course) => course.id !== id);

    return { message: `El curso con id ${id} fue eliminado!` };
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

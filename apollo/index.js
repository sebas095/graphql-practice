const { ApolloServer } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");

let courses = require("./data/courses");

const typeDefs = `
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
`;

const resolvers = {
  Query: {
    getCourses(obj, { page, limit }) {
      if (page !== undefined) {
        return courses.slice((page - 1) * limit, page * limit);
      }
      return courses;
    },

    getCourse(obj, { id }) {
      return courses.find((course) => course.id === id);
    },
  },

  Mutation: {
    addCourse(obj, { input: { title, views } }) {
      const id = String(courses.length + 1);
      const course = { id, title, views };
      courses.push(course);

      return course;
    },

    updateCourse(obj, { id, input: { title, views } }) {
      const index = courses.findIndex((course) => course.id === id);
      const course = courses[index];

      let newCourse = views
        ? { ...course, title, views }
        : { ...course, title };
      courses[index] = newCourse;

      return newCourse;
    },

    deleteCourse(obj, { id }) {
      courses = courses.filter((course) => course.id !== id);

      return { message: `El curso con id ${id} fue eliminado!` };
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
});

server.listen().then(({ url }) => {
  console.log(`Server running on ${url}`);
});

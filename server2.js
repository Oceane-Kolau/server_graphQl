const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// GraphQL schema
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        coursesByTitle(search: String!): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
        createCourse(course : CourseInput!): [Course]
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    },
    input CourseInput {
      id: Int,
      title: String,
      author: String,
      description: String,
      topic: String,
      url: String
    }
`);

const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

const getCourse = function(args) { 
    const id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

const getCourses = function(args) {
    if (args.topic) {
        const topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

const getCoursesByTitle = function (args) {
    const search = args.search;
    return coursesData.filter(course => course.title.includes(search)
    );
}

const updateCourseTopic = function ({ id, topic }) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id)[0];
}

const createCourse = function ({ course }) {
    coursesData.push(course);
    return coursesData;
}

const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic,
    createCourse: createCourse,
    coursesByTitle: getCoursesByTitle
};


// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(3000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
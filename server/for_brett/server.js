const graphql = require('graphql');
const _ = require('lodash');

// Destructure needed property from graphql -- destructuring is an ES6 syntax, 
// that pulls properties off objects. if you're familiar with it but can read up on it here:
// https://www.google.com/search?q=destructuring+es6&oq=destructuring+es6&aqs=chrome..69i57j0l5.4263j1j7&sourceid=chrome&ie=UTF-8
// Each one of these are data types specific to GraphQL
// Check out the different GraphQL Data Types, including GraphQLObjectType and GraphQLSchema: 
// https://graphql.org/graphql-js/type/ 
// Esenntialy, each GraphQL data type is what it states it is. 
// Research GraphQLObjectType and GraphQLSchema, as those aren't as straightforward as GraphQLID, GraphQLInt, GraphQLObjectType
// ID is a number, Int is a number, GraphQLObjectType is an Object that defines a database object & its properties 
const {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = graphql;

// dummy data
var books = [{
    name: 'Name of the Wind',
    genre: 'Fantasy',
    id: '1',
    authorId: '1',
  },
  {
    name: 'The Final Empire',
    genre: 'Fantasy',
    id: '2',
    authorId: '2',
  },
  {
    name: 'The Long Earth',
    genre: 'Sci-Fi',
    id: '3',
    authorId: '3',
  },
];


// dummy data
var authors = [{
    name: 'Patrick Rothfuss',
    age: 44,
    id: '1'
  },
  {
    name: 'Brandon Sanderson',
    age: 42,
    id: '2'
  },
  {
    name: 'Terry Pratchett',
    age: 24,
    id: '3'
  },
];

// Define a BookType using GraphQLObjectType
// Notice that it is given a name, this is the name of the Database Object!
// The fields are the fields of the different properties of the Book Object!
// The id, name, genre fields are GraphQL data types.
// The author property is an OBJECT, which containts the type of AuthorType, which is specified below!
// The type: AuthorType property is a GraphQLObject. Which is the same as the BookType object you're
// looking at here.
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    // string of random numbers
    // must be GraphQLString so that GraphQL understands it
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    genre: {
      type: GraphQLString
    },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return _.find(authors, {
          id: parent.authorId
        });
      },
    },
  }),
});

/**
 * An AuthorType object which describes this author!
 * The fields are the properties which describe this author!
 * Notice how each field is different.
 * The fields that describe this author: 
 * id has a type of GraphQLID (Just a number basically)
 * name has a type of GraphQLString (A String)
 * age has a type of GraphQLInt (An integer, basically just a number)
 */
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    },
  }),
});

/**
 * This is where we write our RootQuery. 
 * RootQuery wil contain every Query that we can write to our GraphQLServer! 
 * Notice we give it a name, called 'RootQueryType'
 * Notice that it's also a GraphQLObjectType!
 * 
 * The fields property accept an Object, which contains multiple properties such as book and author.
 * These multiple properties are the things which we'll BE ABLE TO SEARCH FOR within our query. 
 * 
 *  BOOK PROPERTY WITHIN FIELDS EXPLANATION
 * 
 * 1. type: BookType -- Notice that we defined BookType above! We're passing in all
 * the different fields for BookType by simply saying type: BookType
 * 2. args: {id: {type: GraphQLID}} -- we'll be searching for the booktype via it's id 
 * property (see line 27 to see the id property declared on BookType)
 * 3. resolve -- a promise function accepting (parent, args). 
 *    1st parameter: parent - gives access to the fields of the BookType properties.
 *    2nd parameter: args - gives access to the args: {id: {type: GraphQLID}} found on line 90
 * 
 * AUTHOR PROPERTY WITHIN FIELDS EXPLANATION
 * 
 * 1. type: AuthorType -- Notice we defined AuthorType above! Passing in all different fields for 
 * AuthorType by simply saying type: AuthorType
 * 2. args: {id: {type: GraphQLID}} -- we'll be searching for the author via it's id
 * property (see line 52)
 * 3. resolve -- a promise function accepting (parent, args).
 *  1st parameter: parent - gives access to the fields of the AuthorType properties.
 *  2nd parameter: args - gives access to the args: {id: {type: GraphQLID}} found on line 90
 */
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        // code to get data from db / other source
        console.log(typeof args.id);
        return _.find(books, {
          id: args.id
        });
      },
    },
    author: {
      type: AuthorType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return _.find(authors, {
          id: args.id
        });
      },
    },
  },
});


// export it for use in server/app.js
module.exports = new GraphQLSchema({
  query: RootQuery
});
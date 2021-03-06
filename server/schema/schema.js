const graphql = require('graphql');
const _ = require('lodash');

// Destructure this property from graphql
// GraphQLString is needed for graphql to understand it
const {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = graphql;

// dummy data
var books = [
  {
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

var authors = [
  {name: 'Patrick Rothfuss', age: 44, id: '1'},
  {name: 'Brandon Sanderson', age: 42, id: '2'},
  {name: 'Terry Pratchett', age: 24, id: '3'},
];

/**
 * Takes in object which describes what this book is about.
 */
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    // string of random numbers
    // must be GraphQLString so that GraphQL understands it
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return _.find(authors, {id: parent.authorId});
      },
    },
  }),
});

/**
 * Takes in object which describes this author.
 */
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    // string of random numbers
    // must be GraphQLString so that GraphQL understands it
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    /**
     * this name matters becuz when we try and to grab from friend end,
     * we need to know name of this because of the query structure
     * mutation {
     *    book{
     *      properties here
     *    }
     * }
     */
    book: {
      type: BookType,
      args: {id: {type: GraphQLID}},
      /*
      parent will come into play when we talk about relationships
      between data
      args is because we will be passing in an id for the argument paremeter,
      so now we have access to it in the resolve function
      
      */
      resolve(parent, args) {
        // code to get data from db / other source
        console.log(typeof args.id);
        return _.find(books, {id: args.id});
      },
    },
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return _.find(authors, {id: args.id});
      },
    },
  },
});

/*
  Query Structure From Front End: 
  
  book(id: '123') {
    name  
    genre
  }
*/

module.exports = new GraphQLSchema({query: RootQuery});

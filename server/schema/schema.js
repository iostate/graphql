const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

// Destructure this property from graphql
// GraphQLString is needed for graphql to understand it
const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = graphql;

/**
 * Takes in object which describes this author.
 */
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  // the anonymous function allows the fields to be
  // called at a later time, and not upon loading
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, {authorId: parent.id});
      },
    },
  }),
});

/**
 * Describes a Book GraphQLObjectType.
 *
 * GraphQLObjectType's must be:
 * 1. Named.
 * 2. Given name pair values;
 * 3.
 */
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // console.log(parent);
        // return _.find(authors, {id: parent.authorId});
      },
    },
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
     *      id
     *      name
     *      genre
     *      author {
     *        id
     *        name
     *        age
     *      }
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
        // console.log(typeof args.id);
        // return _.find(books, {id: args.id});
      },
    },
    // returns a single author
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        // return _.find(authors, {id: args.id});
      },
    },
    // returns all authors
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors;
      },
    },
    // returns all authors
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
      },
      resolve(parent, args) {
        // create new Author with fields on args
        // Author is brought in from '../models/author.js';
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        // by returning the saving of author, we get back
        // author properties
        return author.save(); // save to database
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

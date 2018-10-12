// the file corresponds to https://github.com/iostate/graphql/blob/master/server/app.js

const express = require('express');
// convention is graphqlHTTP
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log('now listening for requests');
});

# Welcome to My GraphQL Implementaiton

## Git clone the repository into your desired directory by navigating to the desired directory, and then running

```
  git clone https://github.com/iostate/graphql.git
```

## Run npm install to install dependencies using

```
  npm install
```

## Begin server by running:

```
  node server/app.js
```

## Navigate to http://localhost:4000/graphql to begin querying data

### A GraphQL Query that would work here is:

```
  {
    book(id: 2){
      id
      name
      genre
      author {
        name
      }
  }
}
```

#### Disregard the files in for_brent/. Those are well documented copies of server/app.js & server/schema/schema.js

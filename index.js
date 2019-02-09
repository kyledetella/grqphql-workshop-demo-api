const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { DataStore } = require("./DataStore");

const app = express();

// Auth middleware
// app.use((req, res, next) => {
//   console.log("Verifying auth token");
//   const authToken = req.headers["authorization"].replace(/^Bearer\s/, "");

//   if (authToken !== "123") {
//     res.send(401, { message: "Provide a valid auth token (Bearer 123)" });
//   } else {
//     next();
//   }
// });

const typeDefs = gql`
  type Team {
    id: ID!
    city: String!
    name: String!
    league: League!
  }

  enum League {
    NHL
    NBA
    NFL
    MLB
  }

  type Query {
    teams: [Team]!
    getTeam(teamId: ID!): Team
  }

  type Mutation {
    createTeam(input: CreateTeamInput!): Team
  }

  input CreateTeamInput {
    name: String!
    city: String!
    league: League!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    teams: (_, __, { dataStore }) => Object.values(dataStore.getTeams()),
    getTeam: (_, { teamId }, { dataStore }) => {
      const team = dataStore.getTeam(teamId);
      if (team) {
        return team;
      }

      throw new Error(`No team with id: ${teamId}`);
    }
  },

  Mutation: {
    createTeam: (_, { input }, { dataStore }) => {
      return dataStore.addTeam(input);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ dataStore: DataStore })
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});

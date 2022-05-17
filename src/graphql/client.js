import { ApolloClient, InMemoryCache, gql, makeVar } from "@apollo/client";
import { GET_QUEUED_SONGS } from "./queries";

const client = new ApolloClient({
  uri: "https://apollo-sharemymusic.hasura.app/v1/graphql",
  cache: new InMemoryCache(),

  typeDefs: gql`
    type Song {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      url: String!
      duration: Float!
    }

    type Query {
      queue: [Song]!
    }

    input SongInput {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      url: String!
      duration: Float!
    }

    type Mutation {
      addOrRemoveFromQueue(input: SongInput!): [Song]!
    }
  `,
  resolvers: {
    Mutation: {
      addOrRemoveFromQueue: (_, { input }, { cache }) => {
        const queryResult = cache.readQuery({
          query: GET_QUEUED_SONGS,
        });
        if (queryResult) {
          const { queue } = queryResult;
          const isInQueue = queue.some((song) => song.id === input.id);
          const newQueue = isInQueue
            ? queue.filter((song) => song.id !== input.id)
            : [...queue, input];
          cache.writeQuery({
            query: GET_QUEUED_SONGS,
            data: { queue: newQueue },
          });
          return newQueue;
        }
        return [];
      },
    },
  },

  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret":
      "aGH7UI2vb5D6PrtbJSnkyxC3P1W2L5o59lVMRiQS4vIMEy4kVn0CRniij3q8Ct1Y",
  },
});

const hasQueue = Boolean(localStorage.getItem("queue"));

client.writeQuery({
  query: gql`
    query GetQueue {
      queue
    }
  `,
  data: {
    queue: hasQueue ? JSON.parse(localStorage.getItem("queue")) : [],
  },
});

export default client;

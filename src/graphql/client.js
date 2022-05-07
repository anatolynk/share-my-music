import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://apollo-sharemymusic.hasura.app/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret":
      "aGH7UI2vb5D6PrtbJSnkyxC3P1W2L5o59lVMRiQS4vIMEy4kVn0CRniij3q8Ct1Y",
  },
});

export default client;

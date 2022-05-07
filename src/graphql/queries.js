import { gql } from "@apollo/client";

export const GET_SONGS = gql`
  query getSongs {
    songs(order_by: { created_at: desc }) {
      url
      title
      thumbnail
      id
      duration
      created_at
      artist
    }
  }
`;

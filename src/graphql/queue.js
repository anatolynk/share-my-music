import { makeVar, gql } from "@apollo/client";

export const data = makeVar({ queue: [] });

// export const GET_QUEUED_SONGS = gql`
//   query getQueuedSongs {
//     queue @client {
//       url
//       title
//       thumbnail
//       id
//       duration
//       created_at
//       artist
//     }
//   }
// `;

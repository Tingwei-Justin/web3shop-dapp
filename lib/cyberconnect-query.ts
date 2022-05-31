import { GraphQLClient, gql } from "graphql-request";
import { CYBERCONNECT_ENDPOINT } from 'constant/endpoint'


// Initialize the GraphQL Client
export const client = new GraphQLClient(CYBERCONNECT_ENDPOINT);

export const GET_IDENTITY = gql`
  query($address: String!) {
    identity(address: $address) {
      domain
      followerCount
      followingCount
      social {
        twitter
      }
      avatar
    }
  }
`;

export const FollowStatusQuery = gql`
    query($from: String!, $to:[String!]!) {
        connections(fromAddr: $from, toAddrList: $to) {
            fromAddr
            toAddr
            followStatus {
                isFollowed
                isFollowing
            }
        }
    }
`;

export const TopNRankingsQuery = gql`
  query($first: Int) {
    rankings(first: $first) {
      pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
      }
      list {
        address
        domain
        followerCount
        avatar
      }
    }
  }
`
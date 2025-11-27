import { GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:8000/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const QUERY_USERS = `query { users { id name email role isApproved } }`;

export const QUERY_PATIENTS = `query { approvedPatients { id name email role isApproved } }`;

export const QUERY_THERAPISTS = `query { approvedTherapists { id name email role isApproved specialty } }`;

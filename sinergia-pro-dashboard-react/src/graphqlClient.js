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

export const QUERY_DASHBOARD_STATS = `query {
  users { id isApproved role }
  approvedPatients { id }
  approvedTherapists { id }
}`;

export const MUTATION_UPDATE_USER = `mutation UpdateUser($id: Int!, $role: String, $name: String, $email: String) {
  updateUser(id: $id, role: $role, name: $name, email: $email) {
    id
    name
    email
    role
    isApproved
  }
}`;

export const MUTATION_APPROVE_USER = `mutation ApproveUser($id: Int!) {
  approveUser(id: $id) {
    id
    name
    email
    role
    isApproved
  }
}`;

export const MUTATION_REJECT_USER = `mutation RejectUser($id: Int!) {
  rejectUser(id: $id) {
    id
    name
    email
    role
    isApproved
  }
}`;

export const MUTATION_DELETE_USER = `mutation DeleteUser($id: Int!) {
  deleteUser(id: $id)
}`;

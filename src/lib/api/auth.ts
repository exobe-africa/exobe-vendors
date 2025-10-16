import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation VendorLogin($input: LoginInput!) {
    login(input: $input) {
      id
      email
      name
      role
      token
    }
  }
`;

export const ME_QUERY = gql`
  query VendorMe {
    me {
      id
      email
      name
      role
    }
  }
`;



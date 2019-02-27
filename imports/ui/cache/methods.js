import { gql } from "react-apollo";

const RESIDENT_DETAILS = gql`
  query($id: String!) {
    residentDetails(id: $id)
  }
`;

export const loadResident = (resId, client) => {
  client.query({
    query: RESIDENT_DETAILS,
    variables: {
      id: resId
    }
  });
};

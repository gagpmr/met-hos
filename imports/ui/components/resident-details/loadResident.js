import gql from "graphql-tag";

const RESIDENT_DETAILS = gql`
  query($id: String!) {
    residentDetails(id: $id)
  }
`;

const loadResident = (resId, client) => {
  client.query({
    query: RESIDENT_DETAILS,
    variables: {
      id: resId
    }
  });
};

export default loadResident;

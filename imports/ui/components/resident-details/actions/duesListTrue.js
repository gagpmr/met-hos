import React from "react";
import PropTypes from "prop-types";
import { gql } from "react-apollo";
import ApolloClient from "apollo-client";

const DUES_LIST_TRUE = gql`
  mutation($id: String!) {
    duesListTrue(id: $id)
  }
`;

const run = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: DUES_LIST_TRUE,
      variables: {
        id: props.resident._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchResident;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const DuesListTrue = props => {
  return (
    <a href="" onClick={e => run(props, e)}>
      <span>Dues List - Add</span>
    </a>
  );
};

DuesListTrue.propTypes = {
  resident: PropTypes.object,
  fetchResident: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default DuesListTrue;

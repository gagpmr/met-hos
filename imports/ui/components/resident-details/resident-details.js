import { gql, graphql, withApollo } from "react-apollo";

import { Actions } from "./actions/actions.js";
import ApolloClient from "apollo-client";
import { Loading } from "/imports/ui/components/shared/Loading.js";
import MessCanteenAccount from "./accounts/mess-canteen/mess-canteen-account.js";
import { Middle } from "../../../modules/styles";
import PrivateAccount from "./accounts/private-account/private-account.js";
import PropTypes from "prop-types";
import React from "react";
import Transaction from "./accounts/transaction/transaction.js";
import { withRouter } from "react-router-dom";

const ResidentDetails = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <Loading />
      </div>
    );
  }
  const resident = props.residentDetails.resident;
  const date = props.residentDetails.effectiveDate;
  return (
    <span>
      <Actions
        resident={resident}
        history={props.history}
        date={date}
        fetchResident={props.fetchResident}
        loadingResident={props.loading}
        client={props.client}
      />
      <PrivateAccount
        resident={resident}
        history={props.history}
        fetchResident={props.fetchResident}
        loadingResident={props.loading}
        client={props.client}
      />
      <MessCanteenAccount
        resident={resident}
        history={props.history}
        fetchResident={props.fetchResident}
        loadingResident={props.loading}
        client={props.client}
      />
      <Transaction
        resident={resident}
        history={props.history}
        fetchResident={props.fetchResident}
        loadingResident={props.loading}
        client={props.client}
      />
    </span>
  );
};

ResidentDetails.propTypes = {
  loading: PropTypes.bool.isRequired,
  residentDetails: PropTypes.object,
  history: PropTypes.object.isRequired,
  fetchResident: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

const RESIDENT_DETAILS = gql`
  query($id: String!) {
    residentDetails(id: $id)
  }
`;

export default graphql(RESIDENT_DETAILS, {
  props: ({ data: { loading, residentDetails, refetch } }) => ({
    loading,
    residentDetails,
    fetchResident: refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      id: ownProps.match.params.resid
    }
  })
})(withRouter(withApollo(ResidentDetails)));

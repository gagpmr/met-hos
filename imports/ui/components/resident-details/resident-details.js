import { gql, graphql, withApollo } from "react-apollo";

import { Actions } from "./actions/actions";
import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import MessCanteenAccount from "./accounts/mess-canteen/mess-canteen-account";
import { Middle } from "../../../modules/styles";
import PrivateAccount from "./accounts/private-account/private-account";
import PropTypes from "prop-types";
import React from "react";
import Transaction from "./accounts/transaction/transaction";
import { withRouter } from "react-router-dom";

const ResidentDetails = ({
  residentDetails,
  fetchResident,
  history,
  loading,
  client
}) => {
  if (loading) {
    return (
      <div style={Middle}>
        <MDSpinner />
      </div>
    );
  }
  const { resident, effectiveDate } = residentDetails;
  return (
    <span>
      <Actions
        resident={resident}
        history={history}
        date={effectiveDate}
        fetchResident={fetchResident}
        loadingResident={loading}
        client={client}
      />
      <PrivateAccount
        resident={resident}
        history={history}
        fetchResident={fetchResident}
        loadingResident={loading}
        client={client}
      />
      <MessCanteenAccount
        resident={resident}
        history={history}
        fetchResident={fetchResident}
        loadingResident={loading}
        client={client}
      />
      <Transaction
        resident={resident}
        history={history}
        fetchResident={fetchResident}
        loadingResident={loading}
        client={client}
      />
    </span>
  );
};

ResidentDetails.propTypes = {
  loading: PropTypes.bool.isRequired,
  residentDetails: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchResident: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
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

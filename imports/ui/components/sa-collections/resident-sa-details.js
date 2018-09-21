import * as Styles from "/imports/modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Loading } from "/imports/ui/components/shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import { SaDetail } from "./sa-detail.js";
import { withRouter } from "react-router-dom";

const ResidentSaDetails = ({ history, details, client, refetch }) => {
  return (
    <span>
      <div className="row">
        <div className="col-md-12">
          <table className="table table-condensed table-striped text-center">
            <thead>
              <tr>
                <th colSpan="14" style={Styles.PrintTableBorder}>
                  RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt
                  Number &nbsp; HS: Hostel Security &nbsp; MS: Mess Security
                  &nbsp; CS: Canteen Security
                </th>
              </tr>
              <tr>
                <th style={Styles.PrintTableBorder}>RD</th>
                <th style={Styles.PrintTableBorder}>DD</th>
                <th style={Styles.PrintTableBorder}>RNo</th>
                <th style={Styles.PrintTableBorder}>Room</th>
                <th style={Styles.PrintTableBorder}>Roll No.</th>
                <th style={Styles.PrintTableBorder}>Name</th>
                <th style={Styles.PrintTableBorder}>HS</th>
                <th style={Styles.PrintTableBorder}>MS</th>
                <th style={Styles.PrintTableBorder}>CS</th>
                <th style={Styles.PrintTableBorder}>Total</th>
                <th colSpan="4" style={Styles.PrintTableBorder}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {details.map((element, index) => (
                <SaDetail
                  key={index}
                  detail={element}
                  history={history}
                  client={client}
                  fetchSaDetails={refetch}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </span>
  );
};

ResidentSaDetails.propTypes = {
  details: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  refetch: PropTypes.func.isRequired
};

const FormatData = props => {
  if (props.loading) {
    return (
      <div style={Styles.Middle}>
        <Loading />
      </div>
    );
  }
  return (
    <ResidentSaDetails
      loading={props.loading}
      details={props.residentSaDetails}
      client={props.client}
      refetch={props.refetch}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  residentSaDetails: PropTypes.array.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

FormatData.defaultProps = {
  residentSaDetails: []
};

const RESIDENT_DETAILS = gql`
  query($resId: String!) {
    residentSaDetails(resId: $resId)
  }
`;

export default graphql(RESIDENT_DETAILS, {
  props: ({ data: { loading, residentSaDetails, refetch } }) => ({
    loading,
    residentSaDetails,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      resId: ownProps.match.params.resId
    }
  })
})(withRouter(withApollo(FormatData)));

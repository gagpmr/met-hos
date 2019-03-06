import { Middle, PrintTableBorder } from "../../../modules/styles";
import { graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import { PaDetail } from "./pa-detail";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";

const ResidentPaDetails = ({ history, details, client, refetch }) => {
  return (
    <span>
      <div className="row">
        <div className="col-md-12">
          <table className="table table-condensed table-striped text-center">
            <tbody>
              <tr>
                <th colSpan="18" style={PrintTableBorder}>
                  RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt Number &nbsp; RR: Room Rent &nbsp; WC:
                  Water Charges &nbsp; EC: Electricity Charges
                  <br />
                  DF: Development Fund &nbsp; RHMC: Routine Hostel Maintenance Charges &nbsp; Misc: Miscellaneous &nbsp;
                </th>
              </tr>
              <tr>
                <th style={PrintTableBorder}>RD</th>
                <th style={PrintTableBorder}>DD</th>
                <th style={PrintTableBorder}>RNo</th>
                <th style={PrintTableBorder}>Room</th>
                <th style={PrintTableBorder}>Roll No.</th>
                <th style={PrintTableBorder}>Name</th>
                <th style={PrintTableBorder}>RR</th>
                <th style={PrintTableBorder}>WC</th>
                <th style={PrintTableBorder}>EC</th>
                <th style={PrintTableBorder}>DF</th>
                <th style={PrintTableBorder}>RHMC</th>
                <th style={PrintTableBorder}>Misc</th>
                <th style={PrintTableBorder}>Total</th>
                <th colSpan="5" style={PrintTableBorder}>
                  Actions
                </th>
              </tr>
              {details.map((element, index) => (
                <PaDetail key={index} detail={element} history={history} client={client} fetchPaDetails={refetch} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </span>
  );
};

ResidentPaDetails.propTypes = {
  details: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  refetch: PropTypes.func.isRequired
};

const FormatData = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <MDSpinner />
      </div>
    );
  }
  return (
    <ResidentPaDetails
      loading={props.loading}
      details={props.residentPaDetails}
      client={props.client}
      refetch={props.refetch}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  residentPaDetails: PropTypes.array.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

FormatData.defaultProps = {
  residentPaDetails: []
};

const RESIDENT_DETAILS = gql`
  query($resId: String!) {
    residentPaDetails(resId: $resId)
  }
`;

export default graphql(RESIDENT_DETAILS, {
  props: ({ data: { loading, residentPaDetails, refetch } }) => ({
    loading,
    residentPaDetails,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      resId: ownProps.match.params.resId
    }
  })
})(withRouter(withApollo(FormatData)));

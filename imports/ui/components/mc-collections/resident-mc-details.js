import { Middle, PrintTableBorder, PrintTableBorderBold } from "../../../modules/styles";
import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import McDetail from "./mc-detail";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";

const ResidentMcDetails = ({ history, details, client, refetch }) => {
  return (
    <span>
      <div className="row">
        <div className="col-md-12">
          <table className="table table-condensed table-striped text-center">
            <tbody>
              <tr>
                <th colSpan="21" style={PrintTableBorder}>
                  RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt Number &nbsp; M-1: Mess One &nbsp; M-2:
                  Mess Two &nbsp; CNT: Canteen &nbsp; AMNT: Amenity &nbsp; FS: Food Subsidy
                  <br />
                  PSWF: Poor Student Welfare Fund &nbsp; MSWF: Mess Canteen Servant Welfare Fund &nbsp; CF: Celebration
                  Fund
                </th>
              </tr>
              <tr style={{ fontSize: "larger" }}>
                <th style={PrintTableBorder}>RD</th>
                <th style={PrintTableBorder}>DD</th>
                <th style={PrintTableBorder}>RNo</th>
                <th style={PrintTableBorder}>Room</th>
                <th style={PrintTableBorder}>Roll No.</th>
                <th style={PrintTableBorder}>Name</th>
                <th style={PrintTableBorder}>M-1</th>
                <th style={PrintTableBorder}>M-2</th>
                <th style={PrintTableBorder}>CNT</th>
                <th style={PrintTableBorder}>Fine</th>
                <th style={PrintTableBorder}>AMNT</th>
                <th style={PrintTableBorder}>FS</th>
                <th style={PrintTableBorder}>PSWF</th>
                <th style={PrintTableBorder}>MSWF</th>
                <th style={PrintTableBorder}>CF</th>
                <th style={PrintTableBorder}>Total</th>
                <th colSpan={5} style={PrintTableBorderBold}>
                  Actions
                </th>
              </tr>
              {details.map(element => (
                <McDetail
                  key={element._id}
                  detail={element}
                  history={history}
                  client={client}
                  fetchMcDetails={refetch}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </span>
  );
};

ResidentMcDetails.propTypes = {
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
    <ResidentMcDetails
      loading={props.loading}
      details={props.residentMcDetails}
      client={props.client}
      refetch={props.refetch}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  residentMcDetails: PropTypes.array.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

FormatData.defaultProps = {
  residentMcDetails: []
};

const RESIDENT_DETAILS = gql`
  query($resId: String!) {
    residentMcDetails(resId: $resId)
  }
`;

export default graphql(RESIDENT_DETAILS, {
  props: ({ data: { loading, residentMcDetails, refetch } }) => ({
    loading,
    residentMcDetails,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      resId: ownProps.match.params.resId
    }
  })
})(withRouter(withApollo(FormatData)));

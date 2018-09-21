import * as Styles from "/imports/modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Loading } from "/imports/ui/components/shared/Loading.js";
import { McDetail } from "./mc-detail.js";
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
                <th colSpan="21" style={Styles.PrintTableBorder}>
                  RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt
                  Number &nbsp; M-1: Mess One &nbsp; M-2: Mess Two &nbsp; CNT:
                  Canteen &nbsp; AMNT: Amenity &nbsp; FS: Food Subsidy
                  <br />
                  PSWF: Poor Student Welfare Fund &nbsp; MSWF: Mess Canteen
                  Servant Welfare Fund &nbsp; CF: Celebration Fund
                </th>
              </tr>
              <tr style={{ fontSize: "larger" }}>
                <th style={Styles.PrintTableBorder}>RD</th>
                <th style={Styles.PrintTableBorder}>DD</th>
                <th style={Styles.PrintTableBorder}>RNo</th>
                <th style={Styles.PrintTableBorder}>Room</th>
                <th style={Styles.PrintTableBorder}>Roll No.</th>
                <th style={Styles.PrintTableBorder}>Name</th>
                <th style={Styles.PrintTableBorder}>M-1</th>
                <th style={Styles.PrintTableBorder}>M-2</th>
                <th style={Styles.PrintTableBorder}>CNT</th>
                <th style={Styles.PrintTableBorder}>Fine</th>
                <th style={Styles.PrintTableBorder}>AMNT</th>
                <th style={Styles.PrintTableBorder}>FS</th>
                <th style={Styles.PrintTableBorder}>PSWF</th>
                <th style={Styles.PrintTableBorder}>MSWF</th>
                <th style={Styles.PrintTableBorder}>CF</th>
                <th style={Styles.PrintTableBorder}>Total</th>
                <th colSpan={5} style={Styles.PrintTableBorderBold}>
                  Actions
                </th>
              </tr>
              {details.map((element, index) => (
                <McDetail
                  key={index}
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

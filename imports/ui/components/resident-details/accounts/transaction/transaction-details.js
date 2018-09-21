import * as Styles from "../../../../../modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Loading } from "/imports/ui/components/shared/Loading.js";
import { McDetail } from "/imports/ui/components/mc-collections/mc-detail.js";
import { PaDetail } from "/imports/ui/components/pa-collections/pa-detail.js";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";

const TRANSACTION_DETAILS = gql`
  query($mcDetId: String!, $paDetId: String!) {
    transactionDetails(mcDetId: $mcDetId, paDetId: $paDetId)
  }
`;

const TransactionDetails = props => {
  return (
    <span>
      <div className="row">
        <div className="col-md-12">
          <table className="table table-condensed table-striped text-center">
            <thead>
              <tr>
                <th colSpan="18" style={Styles.PrintTableBorder}>
                  RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt
                  Number &nbsp; RR: Room Rent &nbsp; WC: Water Charges &nbsp;
                  EC: Electricity Charges
                  <br />
                  DF: Development Fund &nbsp; RHMC: Routine Hostel Maintenance
                  Charges &nbsp; Misc: Miscellaneous &nbsp;
                </th>
              </tr>
              <tr>
                <th style={Styles.PrintTableBorder}>RD</th>
                <th style={Styles.PrintTableBorder}>DD</th>
                <th style={Styles.PrintTableBorder}>RNo</th>
                <th style={Styles.PrintTableBorder}>Room</th>
                <th style={Styles.PrintTableBorder}>Roll No.</th>
                <th style={Styles.PrintTableBorder}>Name</th>
                <th style={Styles.PrintTableBorder}>RR</th>
                <th style={Styles.PrintTableBorder}>WC</th>
                <th style={Styles.PrintTableBorder}>EC</th>
                <th style={Styles.PrintTableBorder}>DF</th>
                <th style={Styles.PrintTableBorder}>RHMC</th>
                <th style={Styles.PrintTableBorder}>Misc</th>
                <th style={Styles.PrintTableBorder}>Total</th>
                <th colSpan="5" style={Styles.PrintTableBorder}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {
                <PaDetail
                  detail={props.paDetail}
                  history={props.history}
                  client={props.client}
                  fetchPaDetails={props.refetch}
                />
              }
            </tbody>
          </table>
        </div>
      </div>
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
              {
                <McDetail
                  detail={props.mcDetail}
                  history={props.history}
                  client={props.client}
                  fetchMcDetails={props.refetch}
                />
              }
            </tbody>
          </table>
        </div>
      </div>
    </span>
  );
};

TransactionDetails.propTypes = {
  paDetail: PropTypes.object.isRequired,
  mcDetail: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

const FormatData = props => {
  if (props.loading) {
    console.log(props.transactionDetails.paDetail);
    return (
      <div style={Styles.Middle}>
        <Loading />
      </div>
    );
  }
  return (
    <TransactionDetails
      loading={props.loading}
      paDetail={props.transactionDetails.paDetail}
      mcDetail={props.transactionDetails.mcDetail}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  transactionDetails: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  transactionDetails: {
    mcDetail: {},
    paDetail: {}
  }
};

export default graphql(TRANSACTION_DETAILS, {
  props: ({ data: { loading, transactionDetails, refetch } }) => ({
    loading,
    transactionDetails,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      mcDetId: ownProps.match.params.mcDetId,
      paDetId: ownProps.match.params.paDetId
    }
  })
})(withRouter(withApollo(FormatData)));

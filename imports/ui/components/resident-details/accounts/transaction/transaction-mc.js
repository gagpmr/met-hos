import {
  PaddingThreeCenter,
  PaddingThreeCenterBold,
  TableHeader
} from "../../../../../modules/styles";

import ApolloClient from "apollo-client";
import McBillsHeader from "../McbillsHeader";
import PropTypes from "prop-types";
import React from "react";
import { gql } from "react-apollo";

const TXN_REMOVE_MC_BILL = gql`
  mutation($resId: String!, $billId: String!) {
    txnRemoveMcBill(resId: $resId, billId: $billId)
  }
`;

const removeBill = (props, e, billId) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: TXN_REMOVE_MC_BILL,
      variables: {
        resId: props.resident._id,
        billId
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchResident;
    });
};

const TransactionMc = props => {
  if (props.loadingResident) {
    return null;
  }
  return (
    <table
      style={TableHeader}
      className="table table-bordered table-condensed table-striped"
    >
      <thead>
        <McBillsHeader />
      </thead>
      <tbody>
        {props.resident.TxnMcBills.map(doc => (
          <tr key={doc._id}>
            <td style={PaddingThreeCenter}>{doc.SrNo}</td>
            <td style={PaddingThreeCenter}>{doc.BillPeriod}</td>
            <td style={PaddingThreeCenter}>{doc.MessOne}</td>
            <td style={PaddingThreeCenter}>{doc.MessTwo}</td>
            <td style={PaddingThreeCenter}>{doc.MessFine}</td>
            <td style={PaddingThreeCenter}>{doc.Canteen}</td>
            <td style={PaddingThreeCenter}>{doc.CanteenFine}</td>
            <td style={PaddingThreeCenter}>{doc.Amenity}</td>
            <td style={PaddingThreeCenter}>{doc.HalfYearly}</td>
            <td style={PaddingThreeCenter}>{doc.HalfYearlyFine}</td>
            <td style={PaddingThreeCenter}>{doc.Total}</td>
            <td style={PaddingThreeCenterBold}>
              <a
                onClick={e => removeBill(props, e, doc._id)}
                data-toggle="tooltip"
                title="Delete From Transaction"
                href=""
              >
                <i className="fa fa-trash-o" aria-hidden="true" />
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

TransactionMc.propTypes = {
  resident: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchResident: PropTypes.func.isRequired,
  loadingResident: PropTypes.bool.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default TransactionMc;

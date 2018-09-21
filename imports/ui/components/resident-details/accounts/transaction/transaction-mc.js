import React from "react";
import PropTypes from "prop-types";
import { gql } from "react-apollo";
import ApolloClient from "apollo-client";
import * as Styles from "/imports/modules/styles.js";
import McBillsHeader from "../McbillsHeader";

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
      style={Styles.TableHeader}
      className="table table-bordered table-condensed table-striped"
    >
      <thead>
        <McBillsHeader />
      </thead>
      <tbody>
        {props.resident.TxnMcBills.map(doc => (
          <tr key={doc._id}>
            <td style={Styles.PaddingThreeCenter}>{doc.SrNo}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.BillPeriod}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.MessOne}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.MessTwo}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.MessFine}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.Canteen}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.CanteenFine}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.Amenity}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.HalfYearly}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.HalfYearlyFine}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.Total}</td>
            <td style={Styles.PaddingThreeCenterBold}>
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

import React from "react";
import PropTypes from "prop-types";
import { gql } from "react-apollo";
import ApolloClient from "apollo-client";
import PaBillsHeader from "../PabillsHeader";
// import { Bert } from "meteor/themeteorchef:bert";
import * as Styles from "/imports/modules/styles.js";

const TXN_REMOVE_PA_BILL = gql`
  mutation($resId: String!, $billId: String!) {
    txnRemovePaBill(resId: $resId, billId: $billId)
  }
`;

const removeBill = (props, e, billId) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: TXN_REMOVE_PA_BILL,
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

const TransactionPa = props => {
  if (props.loadingResident) {
    return null;
  }
  return (
    <table
      style={Styles.TableHeader}
      className="table table-bordered table-condensed table-striped"
    >
      <thead>
        <PaBillsHeader />
      </thead>
      <tbody>
        {props.resident.TxnPaBills.map(doc => (
          <tr key={doc._id}>
            <td style={Styles.PaddingThreeCenter}>{doc.SrNo}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.BillPeriod}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.RoomRent}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.WaterCharges}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.ElectricityCharges}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.Miscellaneous}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.HalfYearly}</td>
            <td style={Styles.PaddingThreeCenter}>{doc.Security}</td>
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

TransactionPa.propTypes = {
  resident: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchResident: PropTypes.func.isRequired,
  loadingResident: PropTypes.bool.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default TransactionPa;

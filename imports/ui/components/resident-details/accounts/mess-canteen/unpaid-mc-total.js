import React from "react";
import PropTypes from "prop-types";
import { gql } from "react-apollo";
import ApolloClient from "apollo-client";
import { Bert } from "meteor/themeteorchef:bert";
import * as Styles from "/imports/modules/styles.js";

const TXN_ADD_ALL_MC = gql`
  mutation($resId: String!) {
    txnAddAllMc(resId: $resId)
  }
`;

const txnAddAll = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: TXN_ADD_ALL_MC,
      variables: {
        resId: props.resident._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchResident;
    });
};

const mcDetailAll = gql`
  mutation($resId: String!) {
    mcDetailBillAll(resId: $resId)
  }
`;

const createDetail = (props, e) => {
  e.preventDefault();
  Bert.alert("Creating Detail", "success");
  props.client
    .mutate({
      mutation: mcDetailAll,
      variables: {
        resId: props.resident._id,
        billId: props.bill._id,
        billType: props.bill.Type
      }
    })
    .then(({ data }) => {
      props.client.resetStore();
      props.history.push(`/edit-mc-detail/${data.mcDetailBillAll}`);
    });
};

const UnpaidMcTotal = props => {
  if (props.loadingResident || props.bill.Total === 0) {
    return null;
  }
  return (
    <tr>
      <td style={Styles.PaddingThreeCenterBold}>#</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.BillPeriod}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.MessOne}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.MessTwo}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.MessFine}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.Canteen}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.CanteenFine}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.Amenity}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.HalfYearly}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.HalfYearlyFine}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.Total}</td>
      <td colSpan="2" style={Styles.PaddingThreeCenterBold}>
        <a
          onClick={e => createDetail(props, e)}
          data-toggle="tooltip"
          title="Create Pa Detail"
          href=""
        >
          <i className="fa fa-external-link" aria-hidden="true" />
        </a>
      </td>
      <td colSpan="2" style={Styles.PaddingThreeCenterBold}>
        <a
          onClick={e => txnAddAll(props, e)}
          data-toggle="tooltip"
          title="Add All To Transaction"
          href=""
        >
          <i className="fa fa-arrow-down" aria-hidden="true" />
        </a>
      </td>
    </tr>
  );
};

UnpaidMcTotal.propTypes = {
  bill: PropTypes.object,
  resident: PropTypes.object,
  fetchResident: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  loadingResident: PropTypes.bool.isRequired
};

export default UnpaidMcTotal;

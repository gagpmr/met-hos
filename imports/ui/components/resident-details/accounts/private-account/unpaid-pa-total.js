import React from "react";
import PropTypes from "prop-types";
import { gql } from "react-apollo";
import ApolloClient from "apollo-client";
import { Bert } from "meteor/themeteorchef:bert";
import * as Styles from "/imports/modules/styles.js";

const TXN_ADD_ALL_PA = gql`
  mutation($resId: String!) {
    txnAddAllPa(resId: $resId)
  }
`;

const txnAddAll = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: TXN_ADD_ALL_PA,
      variables: {
        resId: props.resident._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchResident;
    });
};

const paDetailAll = gql`
  mutation($resId: String!) {
    paDetailBillAll(resId: $resId)
  }
`;

const createDetail = (props, e) => {
  e.preventDefault();
  Bert.alert("Creating Detail", "success");
  props.client
    .mutate({
      mutation: paDetailAll,
      variables: {
        resId: props.resident._id,
        billId: props.bill._id,
        billType: props.bill.Type
      }
    })
    .then(({ data }) => {
      props.client.resetStore();
      props.history.push(`/edit-pa-detail/${data.paDetailBillAll}`);
    });
};

const UnpaidPaTotal = props => {
  if (props.loadingResident || props.bill.Total === 0) {
    return null;
  }
  return (
    <tr>
      <td style={Styles.PaddingThreeCenterBold}>#</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.BillPeriod}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.RoomRent}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.WaterCharges}</td>
      <td style={Styles.PaddingThreeCenterBold}>
        {props.bill.ElectricityCharges}
      </td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.Miscellaneous}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.HalfYearly}</td>
      <td style={Styles.PaddingThreeCenterBold}>{props.bill.Security}</td>
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

UnpaidPaTotal.propTypes = {
  bill: PropTypes.object,
  resident: PropTypes.object,
  fetchResident: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  loadingResident: PropTypes.bool.isRequired
};

export default UnpaidPaTotal;
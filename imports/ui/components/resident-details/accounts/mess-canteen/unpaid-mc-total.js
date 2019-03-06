import ApolloClient from "apollo-client";
import { Bert } from "meteor/themeteorchef:bert";
import { PaddingThreeCenterBold } from "../../../../../modules/styles";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";

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

const EDIT_MC_DETAIL = gql`
  query($detId: String!) {
    editMcDetail(detId: $detId)
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
      props.client.resetStore().then(() => {
        props.client
          .query({
            query: EDIT_MC_DETAIL,
            variables: {
              detId: data.mcDetailBillAll
            }
          })
          .then(() => {
            props.history.push(`/edit-mc-detail/${data.mcDetailBillAll}`);
          });
      });
    });
};

const UnpaidMcTotal = props => {
  if (props.loadingResident || props.bill.Total === 0) {
    return null;
  }
  return (
    <tr>
      <td style={PaddingThreeCenterBold}>#</td>
      <td style={PaddingThreeCenterBold}>{props.bill.BillPeriod}</td>
      <td style={PaddingThreeCenterBold}>{props.bill.MessOne}</td>
      <td style={PaddingThreeCenterBold}>{props.bill.MessTwo}</td>
      <td style={PaddingThreeCenterBold}>{props.bill.MessFine}</td>
      <td style={PaddingThreeCenterBold}>{props.bill.Canteen}</td>
      <td style={PaddingThreeCenterBold}>{props.bill.CanteenFine}</td>
      <td style={PaddingThreeCenterBold}>{props.bill.Amenity}</td>
      <td style={PaddingThreeCenterBold}>{props.bill.HalfYearly}</td>
      <td style={PaddingThreeCenterBold}>{props.bill.HalfYearlyFine}</td>
      <td style={PaddingThreeCenterBold}>{props.bill.Total}</td>
      <td colSpan="2" style={PaddingThreeCenterBold}>
        <a
          onClick={e => createDetail(props, e)}
          data-toggle="tooltip"
          title="Create Pa Detail"
          href=""
        >
          <i className="fa fa-external-link" aria-hidden="true" />
        </a>
      </td>
      <td colSpan="2" style={PaddingThreeCenterBold}>
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
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  loadingResident: PropTypes.bool.isRequired
};

export default UnpaidMcTotal;

import {
  PaddingThreeCenter,
  PaddingThreeCenterBold
} from "../../../../../modules/styles";

import ApolloClient from "apollo-client";
import { Bert } from "meteor/themeteorchef:bert";
import PropTypes from "prop-types";
import React from "react";
import { gql } from "react-apollo";

const REMOVE_MC_BILL = gql`
  mutation($resId: String!, $billId: String!) {
    removeMcBill(resId: $resId, billId: $billId)
  }
`;

const removeBill = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: REMOVE_MC_BILL,
      variables: {
        resId: props.resident._id,
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchResident;
    });
};

const editBill = (props, e) => {
  e.preventDefault();
  props.history.push(`/edit-mc-bill/${props.resident._id}/${props.bill._id}`);
};

const TXN_ADD_MC_BILL = gql`
  mutation($resId: String!, $billId: String!) {
    txnAddMcBill(resId: $resId, billId: $billId)
  }
`;

const txnAdd = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: TXN_ADD_MC_BILL,
      variables: {
        resId: props.resident._id,
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchResident;
    });
};

const mcDetailBill = gql`
  mutation($resId: String!, $billType: String!, $billId: String!) {
    mcDetailBill(resId: $resId, billType: $billType, billId: $billId)
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
      mutation: mcDetailBill,
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
              detId: data.mcDetailBill
            }
          })
          .then(() => {
            props.history.push(`/edit-mc-detail/${data.mcDetailBill}`);
          });
      });
    });
};

const UnpaidMc = props => {
  if (props.loadingResident) {
    return null;
  }
  return (
    <tr>
      <td style={PaddingThreeCenter}>{props.bill.SrNo}</td>
      <td style={PaddingThreeCenter}>{props.bill.BillPeriod}</td>
      <td style={PaddingThreeCenter}>{props.bill.MessOne}</td>
      <td style={PaddingThreeCenter}>{props.bill.MessTwo}</td>
      <td style={PaddingThreeCenter}>{props.bill.MessFine}</td>
      <td style={PaddingThreeCenter}>{props.bill.Canteen}</td>
      <td style={PaddingThreeCenter}>{props.bill.CanteenFine}</td>
      <td style={PaddingThreeCenter}>{props.bill.Amenity}</td>
      <td style={PaddingThreeCenter}>{props.bill.HalfYearly}</td>
      <td style={PaddingThreeCenter}>{props.bill.HalfYearlyFine}</td>
      <td style={PaddingThreeCenter}>{props.bill.Total}</td>
      <td style={PaddingThreeCenterBold}>
        <a
          onClick={e => createDetail(props, e)}
          data-toggle="tooltip"
          title="Create Pa Detail"
          href=""
        >
          <i className="fa fa-external-link" aria-hidden="true" />
        </a>
      </td>
      <td style={PaddingThreeCenter}>
        <a
          onClick={e => editBill(props, e)}
          data-toggle="tooltip"
          title="Edit Bill"
          href=""
        >
          <i className="fa fa-pencil-square-o" />
        </a>
      </td>
      <td style={PaddingThreeCenter}>
        <a
          onClick={e => txnAdd(props, e)}
          data-resid={props.resident._id}
          data-billid={props.bill._id}
          data-toggle="tooltip"
          title="Add To Transaction"
          href=""
        >
          <i className="fa fa-arrow-down" aria-hidden="true" />
        </a>
      </td>
      <td style={PaddingThreeCenter}>
        <a
          onClick={e => removeBill(props, e)}
          data-toggle="tooltip"
          title="Delete Bill"
          href=""
        >
          <i className="fa fa-trash-o" aria-hidden="true" />
        </a>
      </td>
    </tr>
  );
};

UnpaidMc.propTypes = {
  bill: PropTypes.object,
  resident: PropTypes.object,
  fetchResident: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  loadingResident: PropTypes.bool.isRequired
};

export default UnpaidMc;

import React from "react";
import PropTypes from "prop-types";
import ApolloClient from "apollo-client";
import { gql } from "react-apollo";
import { Bert } from "meteor/themeteorchef:bert";
import * as Styles from "/imports/modules/styles.js";

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

const srnodown = (props, e) => {
  e.preventDefault();
  // const srno = e.currentTarget.dataset.srno;
  // const billid = e.currentTarget.dataset.billid;
  // const resid = e.currentTarget.dataset.resid;
  // const targetsrno = parseInt(srno, 10) - 1;
  // const data = {
  //   ResidentId: resid,
  //   BillId: billid,
  //   UpdateMcBillSrNo: true,
  //   SrNo: srno,
  //   TargetSrNo: targetsrno
  // };
};

const srnoup = (props, e) => {
  e.preventDefault();
  // const srno = e.currentTarget.dataset.srno;
  // const billid = e.currentTarget.dataset.billid;
  // const resid = e.currentTarget.dataset.resid;
  // const targetsrno = parseInt(srno, 10) + 1;
  // const data = {
  //   ResidentId: resid,
  //   BillId: billid,
  //   UpdateMcBillSrNo: true,
  //   SrNo: srno,
  //   TargetSrNo: targetsrno
  // };
};

const mcDetailBill = gql`
  mutation($resId: String!, $billType: String!, $billId: String!) {
    mcDetailBill(resId: $resId, billType: $billType, billId: $billId)
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
      props.client.resetStore();
      props.history.push(`/edit-mc-detail/${data.mcDetailBill}`);
    });
};

const UnpaidMc = props => {
  if (props.loadingResident) {
    return null;
  }
  return (
    <tr>
      <td style={Styles.PaddingThreeCenter}>{props.bill.SrNo}</td>
      <td style={Styles.PaddingThreeCenter}>{props.bill.BillPeriod}</td>
      <td style={Styles.PaddingThreeCenter}>{props.bill.MessOne}</td>
      <td style={Styles.PaddingThreeCenter}>{props.bill.MessTwo}</td>
      <td style={Styles.PaddingThreeCenter}>{props.bill.MessFine}</td>
      <td style={Styles.PaddingThreeCenter}>{props.bill.Canteen}</td>
      <td style={Styles.PaddingThreeCenter}>{props.bill.CanteenFine}</td>
      <td style={Styles.PaddingThreeCenter}>{props.bill.Amenity}</td>
      <td style={Styles.PaddingThreeCenter}>{props.bill.HalfYearly}</td>
      <td style={Styles.PaddingThreeCenter}>{props.bill.HalfYearlyFine}</td>
      <td style={Styles.PaddingThreeCenter}>{props.bill.Total}</td>
      {/* <td style={Styles.PaddingThreeCenter}>
        <a
          onClick={e => srnodown(props, e)}
          data-srno={props.bill.SrNo}
          data-billid={props.bill._id}
          data-resid={props.resident._id}
          data-toggle="tooltip"
          title="Serial Number Decrease"
          href=""
        >
          <i className="fa fa-arrow-circle-up" aria-hidden="true" />
        </a>
      </td>
      <td style={Styles.PaddingThreeCenter}>
        <a
          onClick={e => srnoup(props, e)}
          data-srno={props.bill.SrNo}
          data-billid={props.bill._id}
          data-resid={props.resident._id}
          data-toggle="tooltip"
          title="Serial Number Increase"
          href=""
        >
          <i className="fa fa-arrow-circle-down" aria-hidden="true" />
        </a>
      </td> */}
      <td style={Styles.PaddingThreeCenterBold}>
        <a
          onClick={e => createDetail(props, e)}
          data-toggle="tooltip"
          title="Create Pa Detail"
          href=""
        >
          <i className="fa fa-external-link" aria-hidden="true" />
        </a>
      </td>
      <td style={Styles.PaddingThreeCenter}>
        <a
          onClick={e => editBill(props, e)}
          data-toggle="tooltip"
          title="Edit Bill"
          href=""
        >
          <i className="fa fa-pencil-square-o" />
        </a>
      </td>
      <td style={Styles.PaddingThreeCenter}>
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
      <td style={Styles.PaddingThreeCenter}>
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

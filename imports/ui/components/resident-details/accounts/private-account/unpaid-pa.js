import {
  PaddingThreeCenter,
  PaddingThreeCenterBold
} from "../../../../../modules/styles";

import ApolloClient from "apollo-client";
import { Bert } from "meteor/themeteorchef:bert";
import PropTypes from "prop-types";
import React from "react";
import { gql } from "react-apollo";

const REMOVE_PA_BILL = gql`
  mutation($resId: String!, $billId: String!) {
    removePaBill(resId: $resId, billId: $billId)
  }
`;

const removeBill = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: REMOVE_PA_BILL,
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

const EDIT_PA_BILL = gql`
  query($resId: String!, $billId: String!) {
    editPaBill(resId: $resId, billId: $billId)
  }
`;

const editBill = (props, e) => {
  e.preventDefault();
  props.client
    .query({
      query: EDIT_PA_BILL,
      variables: {
        resId: props.resident._id,
        billId: props.bill._id
      }
    })
    .then(() => {
      props.history.push(
        `/edit-pa-bill/${props.resident._id}/${props.bill._id}`
      );
    });
};

const TXN_ADD_PA_BILL = gql`
  mutation($resId: String!, $billId: String!) {
    txnAddPaBill(resId: $resId, billId: $billId)
  }
`;

const txnAdd = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: TXN_ADD_PA_BILL,
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

const paDetailBill = gql`
  mutation($resId: String!, $billType: String!, $billId: String!) {
    paDetailBill(resId: $resId, billType: $billType, billId: $billId)
  }
`;

const EDIT_PA_DETAIL = gql`
  query($detId: String!) {
    editPaDetail(detId: $detId)
  }
`;

const createDetail = (props, e) => {
  e.preventDefault();
  Bert.alert("Creating Detail", "success");
  props.client
    .mutate({
      mutation: paDetailBill,
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
            query: EDIT_PA_DETAIL,
            variables: {
              detId: data.paDetailBill
            }
          })
          .then(() => {
            if (data.paDetailBill !== undefined) {
              props.history.push(`/edit-pa-detail/${data.paDetailBill}`);
            }
          });
      });
    });
};

const srNoDown = (props, e) => {
  e.preventDefault();
  // const srno = e.currentTarget.dataset.srno;
  // const targetsrno = parseInt(srno, 10) - 1;
  // const data = {
  //   ResidentId: props.resident._id,
  //   BillId: props.bill._id,
  //   UpdatePaBillSrNo: true,
  //   SrNo: srno,
  //   TargetSrNo: targetsrno
  // };
  // UpdateResident.call(
  //   {
  //     data
  //   },
  //   error => {
  //     if (error) {
  //       Bert.alert(error, "danger");
  //     }
  //   }
  // );
};

const srNoUp = (props, e) => {
  e.preventDefault();
  // const srno = e.currentTarget.dataset.srno;
  // const targetsrno = parseInt(srno, 10) + 1;
  // const data = {
  //   ResidentId: props.resident._id,
  //   BillId: props.bill._id,
  //   UpdatePaBillSrNo: true,
  //   SrNo: srno,
  //   TargetSrNo: targetsrno
  // };
  // UpdateResident.call(
  //   {
  //     data
  //   },
  //   error => {
  //     if (error) {
  //       Bert.alert(error, "danger");
  //     }
  //   }
  // );
};

const UnpaidPa = props => {
  return (
    <tr>
      <td style={PaddingThreeCenter}>{props.bill.SrNo}</td>
      <td style={PaddingThreeCenter}>{props.bill.BillPeriod}</td>
      <td style={PaddingThreeCenter}>{props.bill.RoomRent}</td>
      <td style={PaddingThreeCenter}>{props.bill.WaterCharges}</td>
      <td style={PaddingThreeCenter}>{props.bill.ElectricityCharges}</td>
      <td style={PaddingThreeCenter}>{props.bill.Miscellaneous}</td>
      <td style={PaddingThreeCenter}>{props.bill.HalfYearly}</td>
      <td style={PaddingThreeCenter}>{props.bill.Security}</td>
      <td style={PaddingThreeCenter}>{props.bill.Total}</td>
      {/* <td style={PaddingThreeCenter}>
        <a
          onClick={e => srNoDown(props, e)}
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
      <td style={PaddingThreeCenter}>
        <a
          onClick={e => srNoUp(props, e)}
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
          <i className="fa fa-pencil-square-o" aria-hidden="true" />
        </a>
      </td>
      <td style={PaddingThreeCenter}>
        <a
          onClick={e => txnAdd(props, e)}
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

UnpaidPa.propTypes = {
  bill: PropTypes.object,
  resident: PropTypes.object,
  fetchResident: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default UnpaidPa;

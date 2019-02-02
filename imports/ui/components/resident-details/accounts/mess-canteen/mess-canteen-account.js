import {
  PaddingThreeCenterLargerBold,
  TableHeader
} from "../../../../../modules/styles";

import ApolloClient from "apollo-client";
import { Bert } from "meteor/themeteorchef:bert";
import McBillsHeader from "../McbillsHeader";
import PropTypes from "prop-types";
import React from "react";
import UnpaidMc from "./unpaid-mc.js";
import UnpaidMcTotal from "./unpaid-mc-total.js";
import { gql } from "react-apollo";

const ADD_MC_BILL = gql`
  mutation($id: String!) {
    addMcBill(id: $id)
  }
`;

const EDIT_MC_BILL = gql`
  query($resId: String!, $billId: String!) {
    editPaBill(resId: $resId, billId: $billId)
  }
`;

const addBill = (props, e) => {
  e.preventDefault();
  Bert.alert("Adding Bill!", "success");
  props.client
    .mutate({
      mutation: ADD_MC_BILL,
      variables: {
        id: props.resident._id
      }
    })
    .then(({ data }) => {
      props.client
        .query({
          query: EDIT_MC_BILL,
          variables: {
            resId: props.resident._id,
            billId: data.addMcBill
          }
        })
        .then(() => {
          props.history.push(
            `/edit-mc-bill/${props.resident._id}/${data.addMcBill}`
          );
        })
        .catch(error => {
          console.log("there was an error sending the query", error);
        });
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
  return true;
};

const MessCanteenAccount = props => {
  if (!props.loadingResident) {
    return (
      <div className="row">
        <div className="col-md-12">
          <table
            style={TableHeader}
            className="table table-bordered table-condensed table-striped"
          >
            <thead>
              <tr>
                <th style={PaddingThreeCenterLargerBold} colSpan="17">
                  Mess Canteen Account&nbsp;
                  <a onClick={e => addBill(props, e)} href="">
                    <i className="fa fa-plus" aria-hidden="true" />
                  </a>
                </th>
              </tr>
              <McBillsHeader />
            </thead>
            <tbody>
              {props.resident.McBills.map(doc => (
                <UnpaidMc
                  key={doc._id}
                  resident={props.resident}
                  bill={doc}
                  fetchResident={props.fetchResident}
                  history={props.history}
                  client={props.client}
                  loadingResident={props.loadingResident}
                />
              ))}
              <UnpaidMcTotal
                bill={props.resident.UnpaidMcTotal}
                resident={props.resident}
                fetchResident={props.fetchResident}
                history={props.history}
                client={props.client}
                loadingResident={props.loadingResident}
              />
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return null;
};

MessCanteenAccount.propTypes = {
  resident: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchResident: PropTypes.func.isRequired,
  loadingResident: PropTypes.bool.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default MessCanteenAccount;

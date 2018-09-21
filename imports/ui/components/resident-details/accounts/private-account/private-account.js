import React from "react";
import PropTypes from "prop-types";
import ApolloClient from "apollo-client";
import { gql } from "react-apollo";
import UnpaidPa from "./unpaid-pa.js";
import { Bert } from "meteor/themeteorchef:bert";
import UnpaidPaTotal from "./unpaid-pa-total.js";
import * as Styles from "/imports/modules/styles.js";
import EditReturnAmount from "./edit-return-amount";
import PaBillsHeader from "../PabillsHeader";

const EDIT_PA_BILL = gql`
  query($resId: String!, $billId: String!) {
    editPaBill(resId: $resId, billId: $billId)
  }
`;

const ADD_PA_BILL = gql`
  mutation($id: String!, $billType: String!) {
    addPaBill(id: $id, billType: $billType)
  }
`;

const addBill = (props, e) => {
  e.preventDefault();
  // If the string constains -D, then it is a daily resident
  Bert.alert("Adding Bill!", "success");
  if (props.resident.RollNumber.includes("-D")) {
    props.client
      .mutate({
        mutation: ADD_PA_BILL,
        variables: {
          id: props.resident._id,
          billType: "daily"
        }
      })
      .then(({ data }) => {
        props.client.resetStore();
        props.client
          .query({
            query: EDIT_PA_BILL,
            variables: {
              resId: props.resident._id,
              billId: data.addPaBill
            }
          })
          .then(() => {
            props.history.push(
              `/edit-pa-bill/${props.resident._id}/${data.addPaBill}`
            );
          })
          .catch(error => {
            console.log("there was an error sending the query", error);
          });
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  } else {
    props.client
      .mutate({
        mutation: ADD_PA_BILL,
        variables: {
          id: props.resident._id,
          billType: "regular"
        }
      })
      .then(({ data }) => {
        props.client.resetStore();
        props.client
          .query({
            query: EDIT_PA_BILL,
            variables: {
              resId: props.resident._id,
              billId: data.addPaBill
            }
          })
          .then(() => {
            props.history.push(
              `/edit-pa-bill/${props.resident._id}/${data.addPaBill}`
            );
          })
          .catch(error => {
            console.log("there was an error sending the query", error);
          });
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }
  return true;
};

const PrivateAccount = props => {
  if (!props.loadingResident) {
    return (
      <div className="row">
        <div className="col-md-12">
          <table
            style={Styles.TableHeader}
            className="table table-bordered table-condensed table-striped"
          >
            <thead>
              <tr>
                <th style={Styles.PaddingThreeCenterLargerBold} colSpan="15">
                  Unpaid Total: &#8377; {props.resident.UnpaidTotal}
                  &nbsp; &nbsp; Return Amount: &#8377;&nbsp;
                  <EditReturnAmount resident={props.resident} />
                  &nbsp; &nbsp; Net Dues: &#8377; {props.resident.NetDues}
                </th>
              </tr>
              <tr>
                <th style={Styles.PaddingThreeCenterLargerBold} colSpan="15">
                  Private Account&nbsp;
                  <a id="addBill" onClick={e => addBill(props, e)} href="">
                    <i className="fa fa-plus" aria-hidden="true" />
                  </a>
                </th>
              </tr>
              <PaBillsHeader />
            </thead>
            <tbody>
              {props.resident.PaBills.map(doc => (
                <UnpaidPa
                  key={doc._id}
                  resident={props.resident}
                  bill={doc}
                  fetchResident={props.fetchResident}
                  history={props.history}
                  client={props.client}
                />
              ))}
              <UnpaidPaTotal
                bill={props.resident.UnpaidPaTotal}
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

PrivateAccount.propTypes = {
  resident: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchResident: PropTypes.func.isRequired,
  loadingResident: PropTypes.bool.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default PrivateAccount;

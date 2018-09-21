import React from "react";
import PropTypes from "prop-types";
import ApolloClient from "apollo-client";
import gqls from "./sharedGqls";
import * as Styles from "/imports/modules/styles.js";

const reduceMessTwo = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updateMcBillType,
      variables: {
        id: props.resident._id,
        billType: "messTwo",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchEditMcBill;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const reduceMessOne = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updateMcBillType,
      variables: {
        id: props.resident._id,
        billType: "messOne",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchEditMcBill;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const reduceCanteen = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updateMcBillType,
      variables: {
        id: props.resident._id,
        billType: "canteen",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchEditMcBill;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const halfYearly = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updateMcBillType,
      variables: {
        id: props.resident._id,
        billType: "halfYearly",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.history.push(`/resident-details/${props.resident._id}`);
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const quaterly = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updateMcBillType,
      variables: {
        id: props.resident._id,
        billType: "quarterly",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.history.push(`/resident-details/${props.resident._id}`);
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const McActions = props => {
  return (
    <div className="col-md-3">
      <table className="table table-bordered table-condensed table-striped text-center">
        <thead>
          <tr>
            <th style={Styles.PaddingThreeCenterLargeBold}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">
              <a onClick={e => reduceCanteen(props, e)} href="">
                Reduce Canteen Amount
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => reduceMessOne(props, e)} href="">
                Reduce Mess One Amount
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => reduceMessTwo(props, e)} href="">
                Reduce Mess Two Amount
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => quaterly(props, e)} href="">
                Quarterly
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => halfYearly(props, e)} href="">
                HalfYearly
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

McActions.propTypes = {
  loading: PropTypes.bool.isRequired,
  resident: PropTypes.object,
  bill: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  fetchEditMcBill: PropTypes.func.isRequired
};

export default McActions;

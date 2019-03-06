import ApolloClient from "apollo-client";
import { PaddingThreeCenterLargeBold } from "../../../../../../modules/styles";
import PropTypes from "prop-types";
import React from "react";
import gqls from "./sharedGqls";

const electricityBill = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updatePaBillType,
      variables: {
        id: props.resident._id,
        billType: "electricity",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchEditPaBill;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const nightStay = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updatePaBillType,
      variables: {
        id: props.resident._id,
        billType: "nightStay",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchEditPaBill;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const continuation = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updatePaBillType,
      variables: {
        id: props.resident._id,
        billType: "continuation",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchEditPaBill;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const daily = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updatePaBillType,
      variables: {
        id: props.resident._id,
        billType: "daily",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchEditPaBill;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const fineWarden = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updatePaBillType,
      variables: {
        id: props.resident._id,
        billType: "fineWarden",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchEditPaBill;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const phdHra = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updatePaBillType,
      variables: {
        id: props.resident._id,
        billType: "phdHra",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchEditPaBill;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const halfYearly = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updatePaBillType,
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
      mutation: gqls.updatePaBillType,
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

const security = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: gqls.updatePaBillType,
      variables: {
        id: props.resident._id,
        billType: "security",
        billId: props.bill._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchEditPaBill;
    })
    .catch(error => {
      console.log("there was an error sending the query", error);
    });
};

const PaActions = props => {
  return (
    <div className="col-md-3">
      <table className="table table-bordered table-condensed table-striped text-center">
        <thead>
          <tr>
            <th style={PaddingThreeCenterLargeBold}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">
              <a onClick={e => electricityBill(props, e)} href="">
                Electricity Bill Rows
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => nightStay(props, e)} href="">
                Night Stay Bill Rows
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => continuation(props, e)} href="">
                Continuation Bill Rows
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => daily(props, e)} href="">
                Daily Bill Rows
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => fineWarden(props, e)} href="">
                Fine Warden Rows
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => phdHra(props, e)} href="">
                Phd Hra Rows
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => quaterly(props, e)} href="">
                Miscellaneous 3 Month
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => halfYearly(props, e)} href="">
                Miscellaneous 6 Months
              </a>
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <a onClick={e => security(props, e)} href="">
                Security Bill Row
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

PaActions.propTypes = {
  loading: PropTypes.bool.isRequired,
  resident: PropTypes.object,
  bill: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  fetchEditPaBill: PropTypes.func.isRequired
};

export default PaActions;

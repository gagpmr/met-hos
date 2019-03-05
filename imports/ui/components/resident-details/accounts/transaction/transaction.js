import {
  PaddingThreeCenterLargerBold,
  TableHeader
} from "../../../../../modules/styles";

import ApolloClient from "apollo-client";
import PropTypes from "prop-types";
import React from "react";
import TransactionMc from "./transaction-mc";
import TransactionPa from "./transaction-pa";
import { gql } from "react-apollo";

const TXN_DETAIL_MC = gql`
  mutation($resId: String!) {
    txnDetailMc(resId: $resId)
  }
`;

const createMcDetail = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: TXN_DETAIL_MC,
      variables: {
        resId: props.resident._id
      }
    })
    .then(({ data }) => {
      props.history.push(`/edit-mc-detail/${data.txnDetailMc}`);
    });
};

const TXN_DETAIL_PA = gql`
  mutation($resId: String!) {
    txnDetailPa(resId: $resId)
  }
`;

const createPaDetail = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: TXN_DETAIL_PA,
      variables: {
        resId: props.resident._id
      }
    })
    .then(({ data }) => {
      props.history.push(`/edit-pa-detail/${data.txnDetailPa}`);
    });
};

const TXN_DETAIL_BOTH = gql`
  mutation($resId: String!) {
    txnDetailBoth(resId: $resId)
  }
`;

const createDetails = (props, e) => {
  e.preventDefault();
  if (props.resident.TxnMcTotal === 0) {
    createPaDetail(props, e);
  } else if (props.resident.TxnPaTotal === 0) {
    createMcDetail(props, e);
  } else {
    e.preventDefault();
    props.client
      .mutate({
        mutation: TXN_DETAIL_BOTH,
        variables: {
          resId: props.resident._id
        }
      })
      .then(({ data }) => {
        props.client.resetStore();
        props.history.push(
          `/transaction-details/${data.txnDetailBoth.paDetId}/${
            data.txnDetailBoth.mcDetId
          }`
        );
      });
  }
};

const TXN_REMOVE_ALL_MC = gql`
  mutation($resId: String!) {
    txnRemoveAllMc(resId: $resId)
  }
`;

const removeAllMc = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: TXN_REMOVE_ALL_MC,
      variables: {
        resId: props.resident._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchResident;
    });
};

const TXN_REMOVE_ALL_PA = gql`
  mutation($resId: String!) {
    txnRemoveAllPa(resId: $resId)
  }
`;

const removeAllPa = (props, e) => {
  e.preventDefault();
  props.client
    .mutate({
      mutation: TXN_REMOVE_ALL_PA,
      variables: {
        resId: props.resident._id
      }
    })
    .then(() => {
      props.client.resetStore();
      props.fetchResident;
    });
};

const Transaction = props => {
  return (
    <div className="row">
      <div className="col-md-12">
        <table
          style={TableHeader}
          className="table table-bordered table-condensed table-striped"
        >
          <thead>
            <tr>
              <th style={PaddingThreeCenterLargerBold} colSpan="13">
                Transaction: &nbsp; &#8377; &nbsp;
                {props.resident.TxnTotal}
                {/* <a
                  onClick={e => createDetails(props, e)}
                  data-toggle="tooltip"
                  title="Create Details"
                  href=""
                >
                  {props.resident.TxnTotal}
                </a> */}
              </th>
            </tr>
            <tr>
              <th style={PaddingThreeCenterLargerBold} colSpan="13">
                Mess Canteen: &nbsp; &#8377; &nbsp;
                <a
                  onClick={e => createMcDetail(props, e)}
                  data-toggle="tooltip"
                  title="Create Mc Detail"
                  href=""
                >
                  {props.resident.TxnMcTotal}
                </a>
                &nbsp;&nbsp;
                <strong>
                  <a
                    onClick={e => removeAllMc(props, e)}
                    data-toggle="tooltip"
                    title="Remove All Mc Bills From Transaction"
                    href=""
                  >
                    <i className="fa fa-trash-o" aria-hidden="true" />
                  </a>
                </strong>
                &nbsp; Private Account: &nbsp; &#8377; &nbsp;
                <a
                  onClick={e => createPaDetail(props, e)}
                  data-toggle="tooltip"
                  title="Create Pa Detail"
                  href=""
                >
                  {props.resident.TxnPaTotal}
                </a>
                &nbsp;&nbsp;
                <strong>
                  <a
                    onClick={e => removeAllPa(props, e)}
                    data-toggle="tooltip"
                    title="Remove All Pa Bills From Transaction"
                    href=""
                  >
                    <i className="fa fa-trash-o" aria-hidden="true" />
                  </a>
                </strong>
              </th>
            </tr>
          </thead>
        </table>
        <TransactionMc
          resident={props.resident}
          history={props.history}
          fetchResident={props.fetchResident}
          loadingResident={props.loadingResident}
          client={props.client}
        />
        <TransactionPa
          resident={props.resident}
          history={props.history}
          fetchResident={props.fetchResident}
          loadingResident={props.loadingResident}
          client={props.client}
        />
      </div>
    </div>
  );
};

Transaction.propTypes = {
  resident: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchResident: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  loadingResident: PropTypes.bool.isRequired
};

export default Transaction;

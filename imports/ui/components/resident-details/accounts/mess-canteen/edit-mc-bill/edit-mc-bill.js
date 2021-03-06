import { Middle, PaddingThreeCenterLargeBold } from "../../../../../../modules/styles";
import { graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import FullBill from "./full-bill";
import HalfYearly from "../../halfYearly";
import MDSpinner from "react-md-spinner";
import McActions from "./mcActions";
import PropTypes from "prop-types";
import React from "react";
import ReduceCanteen from "./reduce-canteen";
import ReduceMessOne from "./reduce-mess-one";
import ReduceMessTwo from "./reduce-mess-two";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";

const EditMcBill = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <MDSpinner />
      </div>
    );
  }
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="col-md-4 col-md-offset-3">
          <table className="table table-bordered table-condensed table-striped text-center">
            <thead>
              <tr>
                <th style={PaddingThreeCenterLargeBold} colSpan="2">
                  Edit Bill
                </th>
              </tr>
            </thead>
            {(() => {
              switch (props.editMcBill.bill.Type) {
                case "Canteen":
                  return (
                    <ReduceCanteen
                      resident={props.editMcBill.resident}
                      bill={props.editMcBill.bill}
                      history={props.history}
                      client={props.client}
                      loading={props.loading}
                    />
                  );
                case "MessOne":
                  return (
                    <ReduceMessOne
                      resident={props.editMcBill.resident}
                      bill={props.editMcBill.bill}
                      history={props.history}
                      client={props.client}
                      loading={props.loading}
                    />
                  );
                case "MessTwo":
                  return (
                    <ReduceMessTwo
                      resident={props.editMcBill.resident}
                      bill={props.editMcBill.bill}
                      history={props.history}
                      client={props.client}
                      loading={props.loading}
                    />
                  );
                case "HalfYearly":
                  return (
                    <HalfYearly
                      resident={props.editMcBill.resident}
                      bill={props.editMcBill.bill}
                      history={props.history}
                      loading={props.loading}
                      client={props.client}
                    />
                  );
                case "Quarterly":
                  return (
                    <HalfYearly
                      resident={props.editMcBill.resident}
                      bill={props.editMcBill.bill}
                      loading={props.loading}
                      history={props.history}
                      client={props.client}
                    />
                  );
                default:
                  return (
                    <FullBill
                      bill={props.editMcBill.bill}
                      resident={props.editMcBill.resident}
                      mcmonths={props.editMcBill.mcmonths}
                      loading={props.loading}
                      history={props.history}
                      client={props.client}
                    />
                  );
              }
            })()}
          </table>
        </div>
        <McActions
          resident={props.editMcBill.resident}
          bill={props.editMcBill.bill}
          mcmonths={props.editMcBill.mcmonths}
          fetchEditMcBill={props.refetch}
          loading={props.loading}
          client={props.client}
          history={props.history}
        />
      </div>
    </div>
  );
};

EditMcBill.propTypes = {
  loading: PropTypes.bool.isRequired,
  editMcBill: PropTypes.object,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

const EDIT_MC_BILL = gql`
  query($resId: String!, $billId: String!) {
    editMcBill(resId: $resId, billId: $billId)
  }
`;

export default graphql(EDIT_MC_BILL, {
  props: ({ data: { loading, editMcBill, refetch } }) => ({
    loading,
    editMcBill,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      resId: ownProps.match.params.resId,
      billId: ownProps.match.params.billId
    }
  })
})(withRouter(withApollo(EditMcBill)));

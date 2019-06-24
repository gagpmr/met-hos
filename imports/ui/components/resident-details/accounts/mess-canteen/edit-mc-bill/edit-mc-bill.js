import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import React from "react";
import { graphql, withApollo } from "react-apollo";
import MDSpinner from "react-md-spinner";
import { withRouter } from "react-router-dom";
import { Middle, PaddingThreeCenterLargeBold } from "../../../../../../modules/styles";
import HalfYearly from "../../halfYearly";
import FullBill from "./full-bill";
import McActions from "./mcActions";
import ReduceCanteen from "./reduce-canteen";
import ReduceMessOne from "./reduce-mess-one";
import ReduceMessTwo from "./reduce-mess-two";

const EditMcBill = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <MDSpinner />
      </div>
    );
  }
  return (
    <div style={{ display: "flex" }}>
      <div style={{ margin: "auto", width: "65%", alignItems: "center" }}>
        <div style={{ display: "flex", flexWrap: "nowrap", alignItems: "stretch" }}>
          <div>
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
          <div style={{ width: "3%" }} />
          <div style={{ height: "70%" }}>
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
      </div>
    </div>
  );
};

EditMcBill.propTypes = {
  loading: PropTypes.bool.isRequired,
  editMcBill: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
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

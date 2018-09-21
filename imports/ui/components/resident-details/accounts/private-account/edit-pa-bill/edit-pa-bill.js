import * as Styles from "/imports/modules/styles.js";

import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import Continuation from "./continuation.js";
import Daily from "./daily.js";
import Electricity from "./electricity.js";
import FineWarden from "./fine-warden.js";
import HalfYearly from "../../halfYearly.js";
import { Loading } from "/imports/ui/components/shared/Loading.js";
import NightStay from "./night-stay.js";
import PaActions from "./paActions.js";
import PhdHra from "./phd-hra.js";
import PropTypes from "prop-types";
import React from "react";
import Regular from "./regular.js";
import Security from "./security.js";
import { withRouter } from "react-router-dom";

const EditPaBill = props => {
  if (props.loading) {
    return (
      <div style={Styles.Middle}>
        <Loading />
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
                <th style={Styles.PaddingThreeCenterLargeBold} colSpan="2">
                  Edit Bill
                </th>
              </tr>
            </thead>
            {(() => {
              switch (props.editPaBill.bill.Type) {
                case "Regular":
                  return (
                    <Regular
                      key={1}
                      resident={props.editPaBill.resident}
                      bill={props.editPaBill.bill}
                      pamonths={props.editPaBill.pamonths}
                      history={props.history}
                      client={props.client}
                      selectedMonth={props.editPaBill.selectedMonth}
                    />
                  );
                case "Daily":
                  return (
                    <Daily
                      key={1}
                      resident={props.editPaBill.resident}
                      bill={props.editPaBill.bill}
                      history={props.history}
                      client={props.client}
                    />
                  );
                case "Electricity":
                  return (
                    <Electricity
                      key={1}
                      resident={props.editPaBill.resident}
                      bill={props.editPaBill.bill}
                      history={props.history}
                      client={props.client}
                    />
                  );
                case "NightStay":
                  return (
                    <NightStay
                      key={1}
                      resident={props.editPaBill.resident}
                      bill={props.editPaBill.bill}
                      history={props.history}
                      client={props.client}
                    />
                  );
                case "Continuation":
                  return (
                    <Continuation
                      key={1}
                      resident={props.editPaBill.resident}
                      bill={props.editPaBill.bill}
                      history={props.history}
                      client={props.client}
                    />
                  );
                case "FineWarden":
                  return (
                    <FineWarden
                      key={1}
                      resident={props.editPaBill.resident}
                      bill={props.editPaBill.bill}
                      history={props.history}
                      client={props.client}
                    />
                  );
                case "PhdHra":
                  return (
                    <PhdHra
                      key={1}
                      resident={props.editPaBill.resident}
                      bill={props.editPaBill.bill}
                      history={props.history}
                      client={props.client}
                    />
                  );
                case "HalfYearly":
                  return (
                    <HalfYearly
                      key={1}
                      resident={props.editPaBill.resident}
                      bill={props.editPaBill.bill}
                      history={props.history}
                      client={props.client}
                    />
                  );
                case "Quarterly":
                  return (
                    <HalfYearly
                      key={1}
                      resident={props.editPaBill.resident}
                      bill={props.editPaBill.bill}
                      history={props.history}
                      client={props.client}
                    />
                  );
                case "Security":
                  return (
                    <Security
                      key={1}
                      resident={props.editPaBill.resident}
                      bill={props.editPaBill.bill}
                      history={props.history}
                      client={props.client}
                    />
                  );
                default:
                  return null;
              }
            })()}
          </table>
        </div>
        <PaActions
          resident={props.editPaBill.resident}
          bill={props.editPaBill.bill}
          fetchEditPaBill={props.refetch}
          loading={props.loading}
          client={props.client}
          history={props.history}
        />
      </div>
    </div>
  );
};

EditPaBill.propTypes = {
  loading: PropTypes.bool.isRequired,
  editPaBill: PropTypes.object,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

const EDIT_PA_BILL = gql`
  query($resId: String!, $billId: String!) {
    editPaBill(resId: $resId, billId: $billId)
  }
`;

export default graphql(EDIT_PA_BILL, {
  props: ({ data: { loading, editPaBill, refetch } }) => ({
    loading,
    editPaBill,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      resId: ownProps.match.params.resId,
      billId: ownProps.match.params.billId
    }
  })
})(withRouter(withApollo(EditPaBill)));

import * as Styles from "../../../modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Loading } from "/imports/ui/components/shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import { SaDetail } from "./sa-detail.js";
import { withRouter } from "react-router-dom";

const SaDateDetails = ({
  history,
  details,
  dayCollection,
  client,
  refetch
}) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <table className="table table-condensed table-striped text-center">
          <thead>
            <tr>
              <th colSpan="14" style={Styles.PrintTableBorder}>
                RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt
                Number &nbsp; HS: Hostel Security &nbsp; MS: Mess Security
                &nbsp; CS: Canteen Security
              </th>
            </tr>
            <tr>
              <th style={Styles.PrintTableBorder}>RD</th>
              <th style={Styles.PrintTableBorder}>DD</th>
              <th style={Styles.PrintTableBorder}>RNo</th>
              <th style={Styles.PrintTableBorder}>Room</th>
              <th style={Styles.PrintTableBorder}>Roll No.</th>
              <th style={Styles.PrintTableBorder}>Name</th>
              <th style={Styles.PrintTableBorder}>HS</th>
              <th style={Styles.PrintTableBorder}>MS</th>
              <th style={Styles.PrintTableBorder}>CS</th>
              <th style={Styles.PrintTableBorder}>Total</th>
              <th colSpan="4" style={Styles.PrintTableBorder}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {details.map((element, index) => (
              <SaDetail
                key={index}
                detail={element}
                history={history}
                client={client}
                fetchSaDetails={refetch}
              />
            ))}
            <tr className="text-center">
              <td colSpan="6" style={Styles.PrintTableBorderBold}>
                {""}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.HostelSecurity}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.MessSecurity}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.CanteenSecurity}
              </td>
              <td style={Styles.PrintTableBorderBold}>{dayCollection.Total}</td>
              <td colSpan="4" style={Styles.PrintTableBorderBold}>
                {""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

SaDateDetails.propTypes = {
  details: PropTypes.array.isRequired,
  dayCollection: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  refetch: PropTypes.func.isRequired
};

const FormatData = props => {
  if (props.loading) {
    return (
      <div style={Styles.Middle}>
        <Loading />
      </div>
    );
  }
  return (
    <SaDateDetails
      loading={props.loading}
      details={props.saDateDetails.details}
      dayCollection={props.saDateDetails.dayCollection}
      client={props.client}
      refetch={props.refetch}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  saDateDetails: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

FormatData.defaultProps = {
  saDateDetails: {
    details: [],
    dayCollection: {}
  }
};

const SA_DATE_DETAILS = gql`
  query($date: String!) {
    saDateDetails(date: $date)
  }
`;

export default graphql(SA_DATE_DETAILS, {
  props: ({ data: { loading, saDateDetails, refetch } }) => ({
    loading,
    saDateDetails,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      date: ownProps.match.params.date
    }
  })
})(withRouter(withApollo(FormatData)));

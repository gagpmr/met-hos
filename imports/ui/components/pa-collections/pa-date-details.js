import * as Styles from "/imports/modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Loading } from "/imports/ui/components/shared/Loading.js";
import { PaDetail } from "./pa-detail.js";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";

const PaDateDetails = ({
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
              <th colSpan="18" style={Styles.PrintTableBorder}>
                RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt
                Number &nbsp; RR: Room Rent &nbsp; WC: Water Charges &nbsp; EC:
                Electricity Charges
                <br />
                DF: Development Fund &nbsp; RHMC: Routine Hostel Maintenance
                Charges &nbsp; Misc: Miscellaneous &nbsp;
              </th>
            </tr>
            <tr>
              <th style={Styles.PrintTableBorder}>RD</th>
              <th style={Styles.PrintTableBorder}>DD</th>
              <th style={Styles.PrintTableBorder}>RNo</th>
              <th style={Styles.PrintTableBorder}>Room</th>
              <th style={Styles.PrintTableBorder}>Roll No.</th>
              <th style={Styles.PrintTableBorder}>Name</th>
              <th style={Styles.PrintTableBorder}>RR</th>
              <th style={Styles.PrintTableBorder}>WC</th>
              <th style={Styles.PrintTableBorder}>EC</th>
              <th style={Styles.PrintTableBorder}>DF</th>
              <th style={Styles.PrintTableBorder}>RHMC</th>
              <th style={Styles.PrintTableBorder}>Misc</th>
              <th style={Styles.PrintTableBorder}>Total</th>
              <th colSpan="5" style={Styles.PrintTableBorder}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <PaDetail
                key={index}
                detail={item}
                history={history}
                client={client}
                fetchPaDetails={refetch}
              />
            ))}
            <tr className="text-center">
              <td colSpan="6" style={Styles.PrintTableBorder}>
                {""}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.RoomRent}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.WaterCharges}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.ElectricityCharges}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.DevelopmentFund}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.RutineHstlMaintnceCharges}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.Miscellaneous}
              </td>
              <td style={Styles.PrintTableBorderBold}>{dayCollection.Total}</td>
              <td colSpan="5" style={Styles.PrintTableBorderBold}>
                {""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

PaDateDetails.propTypes = {
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
    <PaDateDetails
      loading={props.loading}
      details={props.paDateDetails.details}
      dayCollection={props.paDateDetails.dayCollection}
      client={props.client}
      refetch={props.refetch}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  paDateDetails: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

FormatData.defaultProps = {
  paDateDetails: {
    details: [],
    dayCollection: {}
  }
};

const PA_DATE_DETAILS = gql`
  query($date: String!) {
    paDateDetails(date: $date)
  }
`;

export default graphql(PA_DATE_DETAILS, {
  props: ({ data: { loading, paDateDetails, refetch } }) => ({
    loading,
    paDateDetails,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      date: ownProps.match.params.date
    }
  })
})(withRouter(withApollo(FormatData)));

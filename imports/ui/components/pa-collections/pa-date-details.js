import { Middle, PrintTableBorder, PrintTableBorderBold } from "../../../modules/styles";
import { graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import { PaDetail } from "./pa-detail";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";

const PaDateDetails = ({ history, details, dayCollection, client, refetch }) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <table className="table table-condensed table-striped text-center">
          <thead>
            <tr>
              <th colSpan="18" style={PrintTableBorder}>
                RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt Number &nbsp; RR: Room Rent &nbsp; WC:
                Water Charges &nbsp; EC: Electricity Charges
                <br />
                DF: Development Fund &nbsp; RHMC: Routine Hostel Maintenance Charges &nbsp; Misc: Miscellaneous &nbsp;
              </th>
            </tr>
            <tr>
              <th style={PrintTableBorder}>RD</th>
              <th style={PrintTableBorder}>DD</th>
              <th style={PrintTableBorder}>RNo</th>
              <th style={PrintTableBorder}>Room</th>
              <th style={PrintTableBorder}>Roll No.</th>
              <th style={PrintTableBorder}>Name</th>
              <th style={PrintTableBorder}>RR</th>
              <th style={PrintTableBorder}>WC</th>
              <th style={PrintTableBorder}>EC</th>
              <th style={PrintTableBorder}>DF</th>
              <th style={PrintTableBorder}>RHMC</th>
              <th style={PrintTableBorder}>Misc</th>
              <th style={PrintTableBorder}>Total</th>
              <th colSpan="5" style={PrintTableBorder}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <PaDetail key={index} detail={item} history={history} client={client} fetchPaDetails={refetch} />
            ))}
            <tr className="text-center">
              <td colSpan="6" style={PrintTableBorder}>
                {""}
              </td>
              <td style={PrintTableBorderBold}>{dayCollection.RoomRent}</td>
              <td style={PrintTableBorderBold}>{dayCollection.WaterCharges}</td>
              <td style={PrintTableBorderBold}>{dayCollection.ElectricityCharges}</td>
              <td style={PrintTableBorderBold}>{dayCollection.DevelopmentFund}</td>
              <td style={PrintTableBorderBold}>{dayCollection.RutineHstlMaintnceCharges}</td>
              <td style={PrintTableBorderBold}>{dayCollection.Miscellaneous}</td>
              <td style={PrintTableBorderBold}>{dayCollection.Total}</td>
              <td colSpan="5" style={PrintTableBorderBold}>
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
  client: PropTypes.instanceOf(ApolloClient).isRequired,
  refetch: PropTypes.func.isRequired
};

const FormatData = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <MDSpinner />
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
  client: PropTypes.instanceOf(ApolloClient).isRequired,
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

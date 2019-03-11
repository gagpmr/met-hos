import { Middle, PaddingFourCenter, PaddingFourCenterBold, PaddingFourCenterLargeBold } from "../../../modules/styles";
import { compose, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import moment from "moment";

export const DUES_REGULAR_RESIDENTS = gql`
  query {
    duesRegularResidents
  }
`;

const renderDuesTotal = duesTotal => (
  <tr>
    <td style={PaddingFourCenterBold}>{duesTotal.SrNo}</td>
    <td style={PaddingFourCenter}>{duesTotal.Room}</td>
    <td style={PaddingFourCenter}>{duesTotal.RollNumber}</td>
    <td style={PaddingFourCenter}>
      <span>{duesTotal.Name}</span>
    </td>
    <td style={PaddingFourCenterBold}>{duesTotal.MessOne}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.MessTwo}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.Canteen}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.Amenity}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.HalfYearlyMc}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.FinesMc}</td>
    <td style={PaddingFourCenterBold}>{duesTotal.TotalMc}</td>
  </tr>
);

const renderList = props => (
  <div className="row">
    <div className="col-md-12">
      <table className="table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th style={PaddingFourCenterLargeBold} colSpan="24">
              Dues - Regular Residents ({moment().format("DD-MM-YYYY")})
            </th>
          </tr>
          <tr>
            <td style={PaddingFourCenterBold}>Sr.</td>
            <td style={PaddingFourCenterBold}>Room</td>
            <td style={PaddingFourCenterBold}>Roll Number</td>
            <td style={PaddingFourCenterBold}>Name</td>
            <td style={PaddingFourCenterBold}>M-1</td>
            <td style={PaddingFourCenterBold}>M-2</td>
            <td style={PaddingFourCenterBold}>CNT</td>
            <td style={PaddingFourCenterBold}>AMNT</td>
            <td style={PaddingFourCenterBold}>HY-MC</td>
            <td style={PaddingFourCenterBold}>
              MC <br /> Fine
            </td>
            <td style={PaddingFourCenterBold}>
              MC <br /> Total
            </td>
          </tr>
        </thead>
        <tbody>
          {props.residents.map((resident, index) => (
            <tr key={resident._id}>
              <td style={PaddingFourCenterBold}>{index + 1}</td>
              <td style={PaddingFourCenter}>{resident.Room.Value}</td>
              <td style={PaddingFourCenter}>{resident.RollNumber}</td>
              <td style={PaddingFourCenter}>
                <span>{resident.Name}</span>
              </td>
              <td style={PaddingFourCenter}>{resident.UnpaidMcTotal.MessOne}</td>
              <td style={PaddingFourCenter}>{resident.UnpaidMcTotal.MessTwo}</td>
              <td style={PaddingFourCenter}>{resident.UnpaidMcTotal.Canteen}</td>
              <td style={PaddingFourCenter}>{resident.UnpaidMcTotal.Amenity}</td>
              <td style={PaddingFourCenter}>{resident.UnpaidMcTotal.HalfYearly}</td>
              <td style={PaddingFourCenter}>
                {resident.UnpaidMcTotal.MessFine +
                  resident.UnpaidMcTotal.CanteenFine +
                  resident.UnpaidMcTotal.HalfYearlyFine}
              </td>
              <td style={PaddingFourCenterBold}>{resident.UnpaidMcTotal.Total}</td>
            </tr>
          ))}
          {renderDuesTotal(props.duesTotal)}
        </tbody>
      </table>
    </div>
  </div>
);

const DuesRegularPrint = props => {
  return renderList(props);
};

DuesRegularPrint.propTypes = {
  loading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
  residents: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Class: PropTypes.shape({
        Value: PropTypes.string.isRequired
      }),
      Room: PropTypes.shape({
        Value: PropTypes.string.isRequired
      }),
      RollNumber: PropTypes.string.isRequired,
      UnpaidMcTotal: PropTypes.object.isRequired,
      UnpaidPaTotal: PropTypes.object.isRequired
    })
  ),
  duesTotal: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
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
    <DuesRegularPrint
      loading={props.loading}
      refetch={props.refetch}
      client={props.client}
      residents={props.duesRegularResidents.residents}
      duesTotal={props.duesRegularResidents.duesTotal}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  duesRegularResidents: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  duesRegularResidents: {}
};

export default compose(
  graphql(DUES_REGULAR_RESIDENTS, {
    props: ({ data: { loading, duesRegularResidents, refetch } }) => ({
      loading,
      duesRegularResidents,
      refetch
    }),
    forceFetch: true
  })
)(withApollo(FormatData));

import * as Styles from "/imports/modules/styles.js";

import { compose, gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Loading } from "../shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

export const DUES_REGULAR_RESIDENTS = gql`
  query {
    duesRegularResidents
  }
`;

const renderDuesTotal = duesTotal => (
  <tr>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.SrNo}</td>
    <td style={Styles.PaddingFourCenter}>{duesTotal.Room}</td>
    <td style={Styles.PaddingFourCenter}>{duesTotal.RollNumber}</td>
    <td style={Styles.PaddingFourCenter}>
      <span>{duesTotal.Name}</span>
    </td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.MessOne}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.MessTwo}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.Canteen}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.Amenity}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.HalfYearlyMc}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.FinesMc}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.TotalMc}</td>
    {/* <td style={Styles.PaddingFourCenterBold}>{duesTotal.RoomRent}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.WaterCharges}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.ElectricityCharges}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.HalfYearlyPa}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.Miscellaneous}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.TotalPa}</td>
    <td style={Styles.PaddingFourCenterBold}>{duesTotal.Total}</td> */}
  </tr>
);

const renderList = props => (
  <div className="row">
    <div className="col-md-12">
      <table className="table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th style={Styles.PaddingFourCenterLargeBold} colSpan="24">
              Dues - Regular Residents ({moment().format("DD-MM-YYYY")})
            </th>
          </tr>
          <tr>
            <td style={Styles.PaddingFourCenterBold}>Sr.</td>
            <td style={Styles.PaddingFourCenterBold}>Room</td>
            <td style={Styles.PaddingFourCenterBold}>Roll Number</td>
            <td style={Styles.PaddingFourCenterBold}>Name</td>
            <td style={Styles.PaddingFourCenterBold}>M-1</td>
            <td style={Styles.PaddingFourCenterBold}>M-2</td>
            <td style={Styles.PaddingFourCenterBold}>CNT</td>
            <td style={Styles.PaddingFourCenterBold}>AMNT</td>
            <td style={Styles.PaddingFourCenterBold}>HY-MC</td>
            <td style={Styles.PaddingFourCenterBold}>
              MC <br /> Fine
            </td>
            <td style={Styles.PaddingFourCenterBold}>
              MC <br /> Total
            </td>
            {/* <td style={Styles.PaddingFourCenterBold}>RR</td>
            <td style={Styles.PaddingFourCenterBold}>WC</td>
            <td style={Styles.PaddingFourCenterBold}>Elec</td>
            <td style={Styles.PaddingFourCenterBold}>
              HY <br /> HST
            </td>
            <td style={Styles.PaddingFourCenterBold}>Misc</td>
            <td style={Styles.PaddingFourCenterBold}>
              HST <br /> Total
            </td>
            <td style={Styles.PaddingFourCenterBold}>Total</td> */}
          </tr>
        </thead>
        <tbody>
          {props.residents.map((resident, index) => (
            <tr key={resident._id}>
              <td style={Styles.PaddingFourCenterBold}>{index + 1}</td>
              <td style={Styles.PaddingFourCenter}>{resident.Room.Value}</td>
              <td style={Styles.PaddingFourCenter}>{resident.RollNumber}</td>
              <td style={Styles.PaddingFourCenter}>
                <span>{resident.Name}</span>
              </td>
              <td style={Styles.PaddingFourCenter}>
                {resident.UnpaidMcTotal.MessOne}
              </td>
              <td style={Styles.PaddingFourCenter}>
                {resident.UnpaidMcTotal.MessTwo}
              </td>
              <td style={Styles.PaddingFourCenter}>
                {resident.UnpaidMcTotal.Canteen}
              </td>
              <td style={Styles.PaddingFourCenter}>
                {resident.UnpaidMcTotal.Amenity}
              </td>
              <td style={Styles.PaddingFourCenter}>
                {resident.UnpaidMcTotal.HalfYearly}
              </td>
              <td style={Styles.PaddingFourCenter}>
                {resident.UnpaidMcTotal.MessFine +
                  resident.UnpaidMcTotal.CanteenFine +
                  resident.UnpaidMcTotal.HalfYearlyFine}
              </td>
              <td style={Styles.PaddingFourCenterBold}>
                {resident.UnpaidMcTotal.Total}
              </td>
              {/* <td style={Styles.PaddingFourCenter}>
                {resident.UnpaidPaTotal.RoomRent}
              </td>
              <td style={Styles.PaddingFourCenter}>
                {resident.UnpaidPaTotal.WaterCharges}
              </td>
              <td style={Styles.PaddingFourCenter}>
                {resident.UnpaidPaTotal.ElectricityCharges}
              </td>
              <td style={Styles.PaddingFourCenter}>
                {resident.UnpaidPaTotal.HalfYearly}
              </td>
              <td style={Styles.PaddingFourCenter}>
                {resident.UnpaidPaTotal.Miscellaneous}
              </td>
              <td style={Styles.PaddingFourCenterBold}>
                {resident.UnpaidPaTotal.Total}
              </td>
              <td style={Styles.PaddingFourCenterBold}>
                {resident.UnpaidTotal}
              </td> */}
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
      <div style={Styles.Middle}>
        <Loading />
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

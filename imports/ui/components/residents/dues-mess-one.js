import {
  Middle,
  PaddingFourCenter,
  PaddingFourCenterBold,
  PaddingFourCenterLargeBold
} from "../../../modules/styles";
import { compose, gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

export const DUES_MESS_ONE = gql`
  query {
    duesMessOne
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
  </tr>
);

const renderList = props => (
  <div className="row">
    <div className="col-md-12">
      <table className="table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th style={PaddingFourCenterLargeBold} colSpan="24">
              Dues - Mess One ({moment().format("DD-MM-YYYY")})
            </th>
          </tr>
          <tr>
            <td style={PaddingFourCenterBold}>Sr.</td>
            <td style={PaddingFourCenterBold}>Room</td>
            <td style={PaddingFourCenterBold}>Roll Number</td>
            <td style={PaddingFourCenterBold}>Name</td>
            <td style={PaddingFourCenterBold}>M-1</td>
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
              <td style={PaddingFourCenter}>
                {resident.UnpaidMcTotal.MessOne}
              </td>
            </tr>
          ))}
          {renderDuesTotal(props.duesTotal)}
        </tbody>
      </table>
    </div>
  </div>
);

const DuesMessOne = props => {
  return renderList(props);
};

DuesMessOne.propTypes = {
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
    <DuesMessOne
      loading={props.loading}
      refetch={props.refetch}
      client={props.client}
      residents={props.duesMessOne.residents}
      duesTotal={props.duesMessOne.duesTotal}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  duesMessOne: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  duesMessOne: {}
};

export default compose(
  graphql(DUES_MESS_ONE, {
    props: ({ data: { loading, duesMessOne, refetch } }) => ({
      loading,
      duesMessOne,
      refetch
    }),
    forceFetch: true
  })
)(withApollo(FormatData));

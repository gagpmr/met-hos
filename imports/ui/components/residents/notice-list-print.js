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

const renderList = props => (
  <div className="row">
    <div className="col-md-8 col-md-offset-2">
      <table className="table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th style={PaddingFourCenterLargeBold} colSpan="20">
              Notice Board List (
              {moment
                .utc()
                .utcOffset(+5.5)
                .format("DD-MM-YYYY")}
              )
            </th>
          </tr>
          <tr>
            <td style={PaddingFourCenterBold}>Sr.</td>
            <td style={PaddingFourCenterBold}>Room</td>
            <td style={PaddingFourCenterBold}>R.No.</td>
            <td style={PaddingFourCenterBold}>Name</td>
            <td style={PaddingFourCenterBold}>Mess Canteen</td>
            <td style={PaddingFourCenterBold}>Hostel</td>
            <td style={PaddingFourCenterBold}>Total</td>
          </tr>
        </thead>
        <tbody>
          {props.residents.map((resident, index) => (
            <tr key={resident._id}>
              <td style={PaddingFourCenterBold}>{index + 1}</td>
              <td style={PaddingFourCenter}>{resident.Room.Value}</td>
              <td style={PaddingFourCenter}>{resident.RollNumber}</td>
              <td style={PaddingFourCenter}>{resident.Name}</td>
              <td style={PaddingFourCenterBold}>
                {resident.UnpaidMcTotal.Total}
              </td>
              <td style={PaddingFourCenterBold}>
                {resident.UnpaidPaTotal.Total}
              </td>
              <td style={PaddingFourCenterBold}>{resident.UnpaidTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const NoticeList = props => {
  return renderList(props);
};

NoticeList.propTypes = {
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
  )
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
    <NoticeList
      loading={props.loading}
      refetch={props.refetch}
      client={props.client}
      residents={props.noticeList}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  noticeList: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  noticeList: []
};

export const residents = gql`
  query {
    noticeList {
      _id
      Name
      Class {
        Value
      }
      Room {
        Value
      }
      RollNumber
      UnpaidMcTotal
      UnpaidPaTotal
      UnpaidTotal
    }
  }
`;

export default compose(
  graphql(residents, {
    props: ({ data: { loading, noticeList, refetch } }) => ({
      loading,
      noticeList,
      refetch
    }),
    forceFetch: true
  })
)(withApollo(FormatData));

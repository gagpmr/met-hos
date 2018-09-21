import * as Styles from "../../../modules/styles";

import { compose, gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Loading } from "../shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

const renderList = props => (
  <div className="row">
    <div className="col-md-8 col-md-offset-2">
      <table className="table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th style={Styles.PaddingFourCenterLargeBold} colSpan="20">
              Notice Board List (
              {moment
                .utc()
                .utcOffset(+5.5)
                .format("DD-MM-YYYY")}
              )
            </th>
          </tr>
          <tr>
            <td style={Styles.PaddingFourCenterBold}>Sr.</td>
            <td style={Styles.PaddingFourCenterBold}>Room</td>
            <td style={Styles.PaddingFourCenterBold}>R.No.</td>
            <td style={Styles.PaddingFourCenterBold}>Name</td>
            <td style={Styles.PaddingFourCenterBold}>Mess Canteen</td>
            <td style={Styles.PaddingFourCenterBold}>Hostel</td>
            <td style={Styles.PaddingFourCenterBold}>Total</td>
          </tr>
        </thead>
        <tbody>
          {props.residents.map((resident, index) => (
            <tr key={resident._id}>
              <td style={Styles.PaddingFourCenterBold}>{index + 1}</td>
              <td style={Styles.PaddingFourCenter}>{resident.Room.Value}</td>
              <td style={Styles.PaddingFourCenter}>{resident.RollNumber}</td>
              <td style={Styles.PaddingFourCenter}>{resident.Name}</td>
              <td style={Styles.PaddingFourCenterBold}>
                {resident.UnpaidMcTotal.Total}
              </td>
              <td style={Styles.PaddingFourCenterBold}>
                {resident.UnpaidPaTotal.Total}
              </td>
              <td style={Styles.PaddingFourCenterBold}>
                {resident.UnpaidTotal}
              </td>
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
      <div style={Styles.Middle}>
        <Loading />
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

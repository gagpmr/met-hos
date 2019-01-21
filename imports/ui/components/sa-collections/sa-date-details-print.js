import {
  Middle,
  PrintTableBorder,
  PrintTableBorderBold
} from "../../../modules/styles";
import { gql, graphql, withApollo } from "react-apollo";

import { Loading } from "../shared/Loading";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

const SaDateDetailsPrint = ({ details, dayCollection }) => {
  return (
    <div className="row">
      <div className="col-md-offset-1 col-md-10">
        <table className="table table-bordered table-condensed table-striped text-center">
          <tbody>
            <tr>
              <th colSpan="14" style={PrintTableBorder}>
                DD: Deposit Date &nbsp; RNo: Receipt Number &nbsp; HS: Hostel
                Security &nbsp; MS: Mess Security &nbsp; CS: Canteen Security
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={PrintTableBorder}>Roll No.</th>
              <th style={PrintTableBorder}>DD</th>
              <th style={PrintTableBorder}>RNo</th>
              <th style={PrintTableBorder}>Name</th>
              <th style={PrintTableBorder}>HS</th>
              <th style={PrintTableBorder}>MS</th>
              <th style={PrintTableBorder}>CS</th>
              <th style={PrintTableBorder}>Total</th>
            </tr>
            {details.map(detail => (
              <tr key={detail._id}>
                <td style={PrintTableBorder}>{detail.RollNumber}</td>
                <td style={PrintTableBorder}>
                  {moment.utc(detail.DepositDate).format("DD-MM-YYYY")}
                </td>
                <td style={PrintTableBorder}>{detail.ReceiptNumber}</td>
                <td style={PrintTableBorder}>{detail.StudentName}</td>
                <td style={PrintTableBorder}>{detail.HostelSecurity}</td>
                <td style={PrintTableBorder}>{detail.MessSecurity}</td>
                <td style={PrintTableBorder}>{detail.CanteenSecurity}</td>
                <td style={PrintTableBorderBold}>{detail.Total}</td>
              </tr>
            ))}
            <tr>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>
                {dayCollection.HostelSecurity}
              </td>
              <td style={PrintTableBorderBold}>{dayCollection.MessSecurity}</td>
              <td style={PrintTableBorderBold}>
                {dayCollection.CanteenSecurity}
              </td>
              <td style={PrintTableBorderBold}>{dayCollection.Total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

SaDateDetailsPrint.propTypes = {
  details: PropTypes.array.isRequired,
  dayCollection: PropTypes.object.isRequired
};

const FormatData = props => {
  if (props.loading) {
    return (
      <div style={Middle}>
        <Loading />
      </div>
    );
  }
  return (
    <SaDateDetailsPrint
      loading={props.loading}
      details={props.saDateDetails.details}
      dayCollection={props.saDateDetails.dayCollection}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  saDateDetails: PropTypes.object.isRequired
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
  props: ({ data: { loading, saDateDetails } }) => ({
    loading,
    saDateDetails
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      date: ownProps.match.params.date
    }
  })
})(withApollo(FormatData));

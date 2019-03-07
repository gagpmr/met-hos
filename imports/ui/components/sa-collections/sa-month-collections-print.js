import { Middle, PrintMonthName, PrintTableBorder, PrintTableBorderBold } from "../../../modules/styles";
import { graphql, withApollo } from "react-apollo";

import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import moment from "moment";
import { withRouter } from "react-router-dom";

const SaMonthlyPrint = ({ details, monthCollection }) => {
  return (
    <div className="row">
      <div className="col-md-offset-1 col-md-10">
        <table className="table table-bordered table-condensed table-striped text-center">
          <tbody>
            <tr>
              <th colSpan="14" style={PrintTableBorder}>
                DD: Deposit Date &nbsp; RNo:Receipt Number; ED: Excess Deposit &nbsp; HS: Hostel Security &nbsp; MS:
                Mess Security &nbsp; CS: Canteen Security
              </th>
            </tr>
            <tr>
              <th colSpan="14" style={PrintMonthName}>
                {monthCollection.DepositMonth}
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={PrintTableBorder}>DD</th>
              <th style={PrintTableBorder}>HS</th>
              <th style={PrintTableBorder}>MS</th>
              <th style={PrintTableBorder}>CS</th>
              <th style={PrintTableBorder}>Total</th>
              <th style={PrintTableBorder}>ED</th>
            </tr>
            {details.map(detail => (
              <tr key={detail._id}>
                <td style={PrintTableBorder}>{moment.utc(detail.DepositDate).format("DD-MM-YYYY")}</td>
                <td style={PrintTableBorder}>{detail.HostelSecurity}</td>
                <td style={PrintTableBorder}>{detail.MessSecurity}</td>
                <td style={PrintTableBorder}>{detail.CanteenSecurity}</td>
                <td style={PrintTableBorderBold}>{detail.Total}</td>
                <td style={PrintTableBorderBold}>{detail.ExcessDeposit}</td>
              </tr>
            ))}
            <tr>
              <td style={PrintTableBorderBold} />
              <td style={PrintTableBorderBold}>{monthCollection.HostelSecurity}</td>
              <td style={PrintTableBorderBold}>{monthCollection.MessSecurity}</td>
              <td style={PrintTableBorderBold}>{monthCollection.CanteenSecurity}</td>
              <td style={PrintTableBorderBold}>{monthCollection.Total}</td>
              <td style={PrintTableBorderBold}>{monthCollection.ExcessDeposit}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

SaMonthlyPrint.propTypes = {
  details: PropTypes.array.isRequired,
  monthCollection: PropTypes.object.isRequired
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
    <SaMonthlyPrint details={props.saMonthlyPrint.details} monthCollection={props.saMonthlyPrint.monthCollection} />
  );
};

FormatData.propTypes = {
  saMonthlyPrint: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

FormatData.defaultProps = {
  saMonthlyPrint: {
    details: [],
    monthCollection: {}
  }
};

const SA_MONTHLY_PRINT = gql`
  query($monthId: String!) {
    saMonthlyPrint(monthId: $monthId)
  }
`;

export default graphql(SA_MONTHLY_PRINT, {
  props: ({ data: { loading, saMonthlyPrint, refetch } }) => ({
    loading,
    saMonthlyPrint,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      monthId: ownProps.match.params.monthId
    }
  })
})(withRouter(withApollo(FormatData)));

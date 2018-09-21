import * as Styles from "../../../modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import { Loading } from "/imports/ui/components/shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";

const SaMonthlyPrint = ({ details, monthCollection }) => {
  return (
    <div className="row">
      <div className="col-md-offset-1 col-md-10">
        <table className="table table-bordered table-condensed table-striped text-center">
          <tbody>
            <tr>
              <th colSpan="14" style={Styles.PrintTableBorder}>
                DD: Deposit Date &nbsp; RNo:Receipt Number; ED: Excess Deposit
                &nbsp; HS: Hostel Security &nbsp; MS: Mess Security &nbsp; CS:
                Canteen Security
              </th>
            </tr>
            <tr>
              <th colSpan="14" style={Styles.PrintMonthName}>
                {monthCollection.DepositMonth}
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={Styles.PrintTableBorder}>DD</th>
              <th style={Styles.PrintTableBorder}>HS</th>
              <th style={Styles.PrintTableBorder}>MS</th>
              <th style={Styles.PrintTableBorder}>CS</th>
              <th style={Styles.PrintTableBorder}>Total</th>
              <th style={Styles.PrintTableBorder}>ED</th>
            </tr>
            {details.map(detail => (
              <tr key={detail._id}>
                <td style={Styles.PrintTableBorder}>
                  {moment.utc(detail.DepositDate).format("DD-MM-YYYY")}
                </td>
                <td style={Styles.PrintTableBorder}>{detail.HostelSecurity}</td>
                <td style={Styles.PrintTableBorder}>{detail.MessSecurity}</td>
                <td style={Styles.PrintTableBorder}>
                  {detail.CanteenSecurity}
                </td>
                <td style={Styles.PrintTableBorderBold}>{detail.Total}</td>
                <td style={Styles.PrintTableBorderBold}>
                  {detail.ExcessDeposit}
                </td>
              </tr>
            ))}
            <tr>
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.HostelSecurity}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.MessSecurity}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.CanteenSecurity}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.Total}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.ExcessDeposit}
              </td>
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
      <div style={Styles.Middle}>
        <Loading />
      </div>
    );
  }
  return (
    <SaMonthlyPrint
      details={props.saMonthlyPrint.details}
      monthCollection={props.saMonthlyPrint.monthCollection}
    />
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

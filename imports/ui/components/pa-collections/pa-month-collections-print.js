import * as Styles from "../../../modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import { Loading } from "/imports/ui/components/shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";

const PaMonthlyPrint = ({ details, monthCollection }) => {
  return (
    <div className="row">
      <div className="col-md-offset-1 col-md-10">
        <table className="table table-bordered table-condensed table-striped text-center">
          <tbody>
            <tr>
              <th colSpan="14" style={Styles.PrintTableBorder}>
                DD: Deposit Date &nbsp; RR: Room Rent &nbsp; WC: Water Charges
                &nbsp; EC: Electricity Charges &nbsp; DF: Development Fund
                <br />
                ED: Excess Deposit &nbsp; RHMC: Routine Hostel Maintenance
                Charges &nbsp; Misc: Miscellaneous
              </th>
            </tr>
            <tr>
              <th colSpan="14" style={Styles.PrintMonthName}>
                {monthCollection.DepositMonth}
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={Styles.PrintTableBorder}>DD</th>
              <th style={Styles.PrintTableBorder}>RR</th>
              <th style={Styles.PrintTableBorder}>WC</th>
              <th style={Styles.PrintTableBorder}>EC</th>
              <th style={Styles.PrintTableBorder}>DF</th>
              <th style={Styles.PrintTableBorder}>RHMC</th>
              <th style={Styles.PrintTableBorder}>Misc</th>
              <th style={Styles.PrintTableBorder}>Total</th>
              <th style={Styles.PrintTableBorder}>ED</th>
            </tr>
            {details.map(detail => (
              <tr key={detail._id}>
                <td style={Styles.PrintTableBorder}>
                  {moment.utc(detail.DepositDate).format("DD-MM-YYYY")}
                </td>
                <td style={Styles.PrintTableBorder}>{detail.RoomRent}</td>
                <td style={Styles.PrintTableBorder}>{detail.WaterCharges}</td>
                <td style={Styles.PrintTableBorder}>
                  {detail.ElectricityCharges}
                </td>
                <td style={Styles.PrintTableBorder}>
                  {detail.DevelopmentFund}
                </td>
                <td style={Styles.PrintTableBorder}>
                  {detail.RutineHstlMaintnceCharges}
                </td>
                <td style={Styles.PrintTableBorder}>{detail.Miscellaneous}</td>
                <td style={Styles.PrintTableBorderBold}>{detail.Total}</td>
                <td style={Styles.PrintTableBorderBold}>
                  {detail.ExcessDeposit}
                </td>
              </tr>
            ))}
            <tr>
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.RoomRent}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.WaterCharges}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.ElectricityCharges}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.DevelopmentFund}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.RutineHstlMaintnceCharges}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.Miscellaneous}
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

PaMonthlyPrint.propTypes = {
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
    <PaMonthlyPrint
      details={props.paMonthlyPrint.details}
      monthCollection={props.paMonthlyPrint.monthCollection}
    />
  );
};

FormatData.propTypes = {
  paMonthlyPrint: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

FormatData.defaultProps = {
  paMonthlyPrint: {
    details: [],
    monthCollection: {}
  }
};

const PA_MONTHLY_PRINT = gql`
  query($monthId: String!) {
    paMonthlyPrint(monthId: $monthId)
  }
`;

export default graphql(PA_MONTHLY_PRINT, {
  props: ({ data: { loading, paMonthlyPrint, refetch } }) => ({
    loading,
    paMonthlyPrint,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      monthId: ownProps.match.params.monthId
    }
  })
})(withRouter(withApollo(FormatData)));

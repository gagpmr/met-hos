import {
  Middle,
  PrintMonthName,
  PrintTableBorder,
  PrintTableBorderBold
} from "../../../modules/styles";
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
              <th colSpan="14" style={PrintTableBorder}>
                DD: Deposit Date &nbsp; RR: Room Rent &nbsp; WC: Water Charges
                &nbsp; EC: Electricity Charges &nbsp; DF: Development Fund
                <br />
                ED: Excess Deposit &nbsp; RHMC: Routine Hostel Maintenance
                Charges &nbsp; Misc: Miscellaneous
              </th>
            </tr>
            <tr>
              <th colSpan="14" style={PrintMonthName}>
                {monthCollection.DepositMonth}
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={PrintTableBorder}>DD</th>
              <th style={PrintTableBorder}>RR</th>
              <th style={PrintTableBorder}>WC</th>
              <th style={PrintTableBorder}>EC</th>
              <th style={PrintTableBorder}>DF</th>
              <th style={PrintTableBorder}>RHMC</th>
              <th style={PrintTableBorder}>Misc</th>
              <th style={PrintTableBorder}>Total</th>
              <th style={PrintTableBorder}>ED</th>
            </tr>
            {details.map(detail => (
              <tr key={detail._id}>
                <td style={PrintTableBorder}>
                  {moment.utc(detail.DepositDate).format("DD-MM-YYYY")}
                </td>
                <td style={PrintTableBorder}>{detail.RoomRent}</td>
                <td style={PrintTableBorder}>{detail.WaterCharges}</td>
                <td style={PrintTableBorder}>{detail.ElectricityCharges}</td>
                <td style={PrintTableBorder}>{detail.DevelopmentFund}</td>
                <td style={PrintTableBorder}>
                  {detail.RutineHstlMaintnceCharges}
                </td>
                <td style={PrintTableBorder}>{detail.Miscellaneous}</td>
                <td style={PrintTableBorderBold}>{detail.Total}</td>
                <td style={PrintTableBorderBold}>{detail.ExcessDeposit}</td>
              </tr>
            ))}
            <tr>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{monthCollection.RoomRent}</td>
              <td style={PrintTableBorderBold}>
                {monthCollection.WaterCharges}
              </td>
              <td style={PrintTableBorderBold}>
                {monthCollection.ElectricityCharges}
              </td>
              <td style={PrintTableBorderBold}>
                {monthCollection.DevelopmentFund}
              </td>
              <td style={PrintTableBorderBold}>
                {monthCollection.RutineHstlMaintnceCharges}
              </td>
              <td style={PrintTableBorderBold}>
                {monthCollection.Miscellaneous}
              </td>
              <td style={PrintTableBorderBold}>{monthCollection.Total}</td>
              <td style={PrintTableBorderBold}>
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
      <div style={Middle}>
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

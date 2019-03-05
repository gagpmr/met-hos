import { Middle, PrintMonthName, PrintTableBorder, PrintTableBorderBold } from "../../../modules/styles";
import { graphql, withApollo } from "react-apollo";

import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import moment from "moment";
import { withRouter } from "react-router-dom";

const McMonthlyPrint = ({ details, monthCollection }) => {
  return (
    <div className="row">
      <div className="col-md-offset-1 col-md-10">
        <table className="table table-bordered table-condensed table-striped text-center">
          <tbody>
            <tr>
              <th colSpan="14" style={PrintTableBorder}>
                DD: Deposit Date &nbsp; M-1: Mess One &nbsp; M-2: Mess Two &nbsp; CNT: Canteen &nbsp; AMNT: Amenity
                &nbsp; FS: Food Subsidy &nbsp; ED: Excess Deposit
                <br />
                PSWF: Poor Student Welfare Fund &nbsp; MSWF: Mess Canteen Servant Welfare Fund &nbsp; CF: Celebration
                Fund
              </th>
            </tr>
            <tr>
              <th colSpan="14" style={PrintMonthName}>
                {monthCollection.DepositMonth}
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={PrintTableBorder}>DD</th>
              <th style={PrintTableBorder}>M-1</th>
              <th style={PrintTableBorder}>M-2</th>
              <th style={PrintTableBorder}>CNT</th>
              <th style={PrintTableBorder}>Fine</th>
              <th style={PrintTableBorder}>AMNT</th>
              <th style={PrintTableBorder}>FS</th>
              <th style={PrintTableBorder}>PSWF</th>
              <th style={PrintTableBorder}>MSWF</th>
              <th style={PrintTableBorder}>CF</th>
              <th style={PrintTableBorder}>Total</th>
              <th style={PrintTableBorder}>ED</th>
            </tr>
            {details.map(detail => (
              <tr key={detail._id}>
                <td style={PrintTableBorder}>{moment.utc(detail.DepositDate).format("DD-MM-YYYY")}</td>
                <td style={PrintTableBorder}>{detail.MessOne}</td>
                <td style={PrintTableBorder}>{detail.MessTwo}</td>
                <td style={PrintTableBorder}>{detail.Canteen}</td>
                <td style={PrintTableBorder}>{detail.Fines}</td>
                <td style={PrintTableBorder}>{detail.Amenity}</td>
                <td style={PrintTableBorder}>{detail.FoodSubsidy}</td>
                <td style={PrintTableBorder}>{detail.PoorStuWelFund}</td>
                <td style={PrintTableBorder}>{detail.McServantWelFund}</td>
                <td style={PrintTableBorder}>{detail.CelebrationFund}</td>
                <td style={PrintTableBorderBold}>{detail.Total}</td>
                <td style={PrintTableBorderBold}>{detail.ExcessDeposit}</td>
              </tr>
            ))}
            <tr>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{monthCollection.MessOne}</td>
              <td style={PrintTableBorderBold}>{monthCollection.MessTwo}</td>
              <td style={PrintTableBorderBold}>{monthCollection.Canteen}</td>
              <td style={PrintTableBorderBold}>{monthCollection.Fines}</td>
              <td style={PrintTableBorderBold}>{monthCollection.Amenity}</td>
              <td style={PrintTableBorderBold}>{monthCollection.FoodSubsidy}</td>
              <td style={PrintTableBorderBold}>{monthCollection.PoorStuWelFund}</td>
              <td style={PrintTableBorderBold}>{monthCollection.McServantWelFund}</td>
              <td style={PrintTableBorderBold}>{monthCollection.CelebrationFund}</td>
              <td style={PrintTableBorderBold}>{monthCollection.Total}</td>
              <td style={PrintTableBorderBold}>{monthCollection.ExcessDeposit}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

McMonthlyPrint.propTypes = {
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
    <McMonthlyPrint details={props.mcMonthlyPrint.details} monthCollection={props.mcMonthlyPrint.monthCollection} />
  );
};

FormatData.propTypes = {
  mcMonthlyPrint: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

FormatData.defaultProps = {
  mcMonthlyPrint: {
    details: [],
    monthCollection: {}
  }
};

const MONTHLY_PRINT = gql`
  query($monthId: String!) {
    mcMonthlyPrint(monthId: $monthId)
  }
`;

export default graphql(MONTHLY_PRINT, {
  props: ({ data: { loading, mcMonthlyPrint, refetch } }) => ({
    loading,
    mcMonthlyPrint,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      monthId: ownProps.match.params.monthId
    }
  })
})(withRouter(withApollo(FormatData)));

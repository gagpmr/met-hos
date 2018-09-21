import * as Styles from "/imports/modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import { Loading } from "/imports/ui/components/shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";

const McMonthlyPrint = ({ details, monthCollection }) => {
  return (
    <div className="row">
      <div className="col-md-offset-1 col-md-10">
        <table className="table table-bordered table-condensed table-striped text-center">
          <tbody>
            <tr>
              <th colSpan="14" style={Styles.PrintTableBorder}>
                DD: Deposit Date &nbsp; M-1: Mess One &nbsp; M-2: Mess Two
                &nbsp; CNT: Canteen &nbsp; AMNT: Amenity &nbsp; FS: Food Subsidy
                &nbsp; ED: Excess Deposit
                <br />
                PSWF: Poor Student Welfare Fund &nbsp; MSWF: Mess Canteen
                Servant Welfare Fund &nbsp; CF: Celebration Fund
              </th>
            </tr>
            <tr>
              <th colSpan="14" style={Styles.PrintMonthName}>
                {monthCollection.DepositMonth}
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={Styles.PrintTableBorder}>DD</th>
              <th style={Styles.PrintTableBorder}>M-1</th>
              <th style={Styles.PrintTableBorder}>M-2</th>
              <th style={Styles.PrintTableBorder}>CNT</th>
              <th style={Styles.PrintTableBorder}>Fine</th>
              <th style={Styles.PrintTableBorder}>AMNT</th>
              <th style={Styles.PrintTableBorder}>FS</th>
              <th style={Styles.PrintTableBorder}>PSWF</th>
              <th style={Styles.PrintTableBorder}>MSWF</th>
              <th style={Styles.PrintTableBorder}>CF</th>
              <th style={Styles.PrintTableBorder}>Total</th>
              <th style={Styles.PrintTableBorder}>ED</th>
            </tr>
            {details.map(detail => (
              <tr key={detail._id}>
                <td style={Styles.PrintTableBorder}>
                  {moment.utc(detail.DepositDate).format("DD-MM-YYYY")}
                </td>
                <td style={Styles.PrintTableBorder}>{detail.MessOne}</td>
                <td style={Styles.PrintTableBorder}>{detail.MessTwo}</td>
                <td style={Styles.PrintTableBorder}>{detail.Canteen}</td>
                <td style={Styles.PrintTableBorder}>{detail.Fines}</td>
                <td style={Styles.PrintTableBorder}>{detail.Amenity}</td>
                <td style={Styles.PrintTableBorder}>{detail.FoodSubsidy}</td>
                <td style={Styles.PrintTableBorder}>{detail.PoorStuWelFund}</td>
                <td style={Styles.PrintTableBorder}>
                  {detail.McServantWelFund}
                </td>
                <td style={Styles.PrintTableBorder}>
                  {detail.CelebrationFund}
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
                {monthCollection.MessOne}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.MessTwo}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.Canteen}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.Fines}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.Amenity}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.FoodSubsidy}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.PoorStuWelFund}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.McServantWelFund}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {monthCollection.CelebrationFund}
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

McMonthlyPrint.propTypes = {
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
    <McMonthlyPrint
      details={props.mcMonthlyPrint.details}
      monthCollection={props.mcMonthlyPrint.monthCollection}
    />
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

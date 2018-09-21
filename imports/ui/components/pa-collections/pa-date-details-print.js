import * as Styles from "../../../modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import { Loading } from "/imports/ui/components/shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

const PaDateDetailsPrint = ({ details, dayCollection }) => {
  return (
    <div className="row">
      <div className="col-md-offset-1 col-md-10">
        <table className="table table-bordered table-condensed table-striped text-center">
          <tbody>
            <tr>
              <th colSpan="14" style={Styles.PrintTableBorder}>
                DD: Deposit Date &nbsp; RNo: Receipt Number &nbsp; Sec: Security
                &nbsp; RR: Room Rent &nbsp; WC: Water Charges &nbsp; EC:
                Electricity Charges &nbsp; CF: Celebration Fund
                <br />
                DF: Development Fund &nbsp; RHMC: Routine Hostel Maintenance
                Charges &nbsp; Misc: Miscellaneous &nbsp;
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={Styles.PrintTableBorder}>Roll No.</th>
              <th style={Styles.PrintTableBorder}>DD</th>
              <th style={Styles.PrintTableBorder}>RNo</th>
              <th style={Styles.PrintTableBorder}>Name</th>
              <th style={Styles.PrintTableBorder}>RR</th>
              <th style={Styles.PrintTableBorder}>WC</th>
              <th style={Styles.PrintTableBorder}>EC</th>
              <th style={Styles.PrintTableBorder}>DF</th>
              <th style={Styles.PrintTableBorder}>RHMC</th>
              <th style={Styles.PrintTableBorder}>Misc</th>
              <th style={Styles.PrintTableBorder}>Total</th>
            </tr>
            {details.map(detail => (
              <tr key={detail._id}>
                <td style={Styles.PrintTableBorder}>{detail.RollNumber}</td>
                <td style={Styles.PrintTableBorder}>
                  {moment.utc(detail.DepositDate).format("DD-MM-YYYY")}
                </td>
                <td style={Styles.PrintTableBorder}>{detail.ReceiptNumber}</td>
                <td style={Styles.PrintTableBorder}>{detail.Name}</td>
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
              </tr>
            ))}
            <tr className="text-left">
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.RoomRent}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.WaterCharges}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.ElectricityCharges}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.DevelopmentFund}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.RutineHstlMaintnceCharges}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.Miscellaneous}
              </td>
              <td style={Styles.PrintTableBorderBold}>{dayCollection.Total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

PaDateDetailsPrint.propTypes = {
  details: PropTypes.array.isRequired,
  dayCollection: PropTypes.object.isRequired
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
    <PaDateDetailsPrint
      loading={props.loading}
      details={props.paDateDetails.details}
      dayCollection={props.paDateDetails.dayCollection}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  paDateDetails: PropTypes.object.isRequired
};

FormatData.defaultProps = {
  paDateDetails: {
    details: [],
    dayCollection: {}
  }
};

const PA_DATE_DETAILS = gql`
  query($date: String!) {
    paDateDetails(date: $date)
  }
`;

export default graphql(PA_DATE_DETAILS, {
  props: ({ data: { loading, paDateDetails } }) => ({
    loading,
    paDateDetails
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      date: ownProps.match.params.date
    }
  })
})(withApollo(FormatData));

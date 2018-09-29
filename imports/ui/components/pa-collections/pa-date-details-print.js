import {
  Middle,
  PrintTableBorder,
  PrintTableBorderBold
} from "../../../modules/styles";
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
              <th colSpan="14" style={PrintTableBorder}>
                DD: Deposit Date &nbsp; RNo: Receipt Number &nbsp; Sec: Security
                &nbsp; RR: Room Rent &nbsp; WC: Water Charges &nbsp; EC:
                Electricity Charges &nbsp; CF: Celebration Fund
                <br />
                DF: Development Fund &nbsp; RHMC: Routine Hostel Maintenance
                Charges &nbsp; Misc: Miscellaneous &nbsp;
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={PrintTableBorder}>Roll No.</th>
              <th style={PrintTableBorder}>DD</th>
              <th style={PrintTableBorder}>RNo</th>
              <th style={PrintTableBorder}>Name</th>
              <th style={PrintTableBorder}>RR</th>
              <th style={PrintTableBorder}>WC</th>
              <th style={PrintTableBorder}>EC</th>
              <th style={PrintTableBorder}>DF</th>
              <th style={PrintTableBorder}>RHMC</th>
              <th style={PrintTableBorder}>Misc</th>
              <th style={PrintTableBorder}>Total</th>
            </tr>
            {details.map(detail => (
              <tr key={detail._id}>
                <td style={PrintTableBorder}>{detail.RollNumber}</td>
                <td style={PrintTableBorder}>
                  {moment.utc(detail.DepositDate).format("DD-MM-YYYY")}
                </td>
                <td style={PrintTableBorder}>{detail.ReceiptNumber}</td>
                <td style={PrintTableBorder}>{detail.Name}</td>
                <td style={PrintTableBorder}>{detail.RoomRent}</td>
                <td style={PrintTableBorder}>{detail.WaterCharges}</td>
                <td style={PrintTableBorder}>{detail.ElectricityCharges}</td>
                <td style={PrintTableBorder}>{detail.DevelopmentFund}</td>
                <td style={PrintTableBorder}>
                  {detail.RutineHstlMaintnceCharges}
                </td>
                <td style={PrintTableBorder}>{detail.Miscellaneous}</td>
                <td style={PrintTableBorderBold}>{detail.Total}</td>
              </tr>
            ))}
            <tr className="text-left">
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{dayCollection.RoomRent}</td>
              <td style={PrintTableBorderBold}>{dayCollection.WaterCharges}</td>
              <td style={PrintTableBorderBold}>
                {dayCollection.ElectricityCharges}
              </td>
              <td style={PrintTableBorderBold}>
                {dayCollection.DevelopmentFund}
              </td>
              <td style={PrintTableBorderBold}>
                {dayCollection.RutineHstlMaintnceCharges}
              </td>
              <td style={PrintTableBorderBold}>
                {dayCollection.Miscellaneous}
              </td>
              <td style={PrintTableBorderBold}>{dayCollection.Total}</td>
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
      <div style={Middle}>
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

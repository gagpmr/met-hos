import {
  Middle,
  PrintTableBorder,
  PrintTableBorderBold
} from "../../../modules/styles";
import { gql, graphql, withApollo } from "react-apollo";

import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

const McDateDetailsPrint = ({ details, dayCollection }) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <table className="table table-condensed table-striped text-center">
          <tbody>
            <tr>
              <th colSpan="21" style={PrintTableBorder}>
                RD: Receipt Date &nbsp; RNo: Receipt Number &nbsp; M-1: Mess One
                &nbsp; M-2: Mess Two &nbsp; CNT: Canteen &nbsp; AMNT: Amenity
                &nbsp; FS: Food Subsidy
                <br />
                PSWF: Poor Student Welfare Fund &nbsp; MSWF: Mess Canteen
                Servant Welfare Fund &nbsp; CF: Celebration Fund
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={PrintTableBorder}>RD</th>
              <th style={PrintTableBorder}>RNo</th>
              <th style={PrintTableBorder}>Room</th>
              <th style={PrintTableBorder}>Roll No.</th>
              <th style={PrintTableBorder}>Name</th>
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
            </tr>
            {details.map((item, index) => (
              <tr key={index} className="text-center">
                <td style={PrintTableBorder}>
                  {moment.utc(item.ReceiptDate).format("DD-MM-YYYY")}
                </td>
                <td style={PrintTableBorder}>{item.ReceiptNumber}</td>
                <td style={PrintTableBorder}>{item.RoomNumber}</td>
                <td style={PrintTableBorder}>{item.RollNumber}</td>
                <td style={PrintTableBorder}>{item.StudentName}</td>
                <td style={PrintTableBorder}>{item.MessOne}</td>
                <td style={PrintTableBorder}>{item.MessTwo}</td>
                <td style={PrintTableBorder}>{item.Canteen}</td>
                <td style={PrintTableBorder}>{item.Fines}</td>
                <td style={PrintTableBorder}>{item.Amenity}</td>
                <td style={PrintTableBorder}>{item.FoodSubsidy}</td>
                <td style={PrintTableBorder}>{item.PoorStuWelFund}</td>
                <td style={PrintTableBorder}>{item.McServantWelFund}</td>
                <td style={PrintTableBorder}>{item.CelebrationFund}</td>
                <td style={PrintTableBorderBold}>{item.Total}</td>
              </tr>
            ))}
            <tr key={dayCollection._id}>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{""}</td>
              <td style={PrintTableBorderBold}>{dayCollection.MessOne}</td>
              <td style={PrintTableBorderBold}>{dayCollection.MessTwo}</td>
              <td style={PrintTableBorderBold}>{dayCollection.Canteen}</td>
              <td style={PrintTableBorderBold}>{dayCollection.Fines}</td>
              <td style={PrintTableBorderBold}>{dayCollection.Amenity}</td>
              <td style={PrintTableBorderBold}>{dayCollection.FoodSubsidy}</td>
              <td style={PrintTableBorderBold}>
                {dayCollection.PoorStuWelFund}
              </td>
              <td style={PrintTableBorderBold}>
                {dayCollection.McServantWelFund}
              </td>
              <td style={PrintTableBorderBold}>
                {dayCollection.CelebrationFund}
              </td>
              <td style={PrintTableBorderBold}>{dayCollection.Total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

McDateDetailsPrint.propTypes = {
  details: PropTypes.array.isRequired,
  dayCollection: PropTypes.object.isRequired
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
    <McDateDetailsPrint
      loading={props.loading}
      details={props.mcDateDetails.details}
      dayCollection={props.mcDateDetails.dayCollection}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  mcDateDetails: PropTypes.object.isRequired
};

FormatData.defaultProps = {
  mcDateDetails: {
    details: [],
    dayCollection: {}
  }
};

const MC_DATE_DETAILS = gql`
  query($date: String!) {
    mcDateDetails(date: $date)
  }
`;

export default graphql(MC_DATE_DETAILS, {
  props: ({ data: { loading, mcDateDetails } }) => ({
    loading,
    mcDateDetails
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      date: ownProps.match.params.date
    }
  })
})(withApollo(FormatData));

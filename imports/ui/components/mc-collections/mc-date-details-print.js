import * as Styles from "/imports/modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import { Loading } from "/imports/ui/components/shared/Loading.js";
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
              <th colSpan="21" style={Styles.PrintTableBorder}>
                RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt
                Number &nbsp; M-1: Mess One &nbsp; M-2: Mess Two &nbsp; CNT:
                Canteen &nbsp; AMNT: Amenity &nbsp; FS: Food Subsidy
                <br />
                PSWF: Poor Student Welfare Fund &nbsp; MSWF: Mess Canteen
                Servant Welfare Fund &nbsp; CF: Celebration Fund
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={Styles.PrintTableBorder}>RD</th>
              <th style={Styles.PrintTableBorder}>DD</th>
              <th style={Styles.PrintTableBorder}>RNo</th>
              <th style={Styles.PrintTableBorder}>Room</th>
              <th style={Styles.PrintTableBorder}>Roll No.</th>
              <th style={Styles.PrintTableBorder}>Name</th>
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
            </tr>
            {details.map((item, index) => (
              <tr key={index} className="text-center">
                <td style={Styles.PrintTableBorder}>
                  {moment.utc(item.ReceiptDate).format("DD-MM-YYYY")}
                </td>
                <td style={Styles.PrintTableBorder}>
                  {moment.utc(item.DepositDate).format("DD-MM-YYYY")}
                </td>
                <td style={Styles.PrintTableBorder}>{item.ReceiptNumber}</td>
                <td style={Styles.PrintTableBorder}>{item.RoomNumber}</td>
                <td style={Styles.PrintTableBorder}>{item.RollNumber}</td>
                <td style={Styles.PrintTableBorder}>{item.StudentName}</td>
                <td style={Styles.PrintTableBorder}>{item.MessOne}</td>
                <td style={Styles.PrintTableBorder}>{item.MessTwo}</td>
                <td style={Styles.PrintTableBorder}>{item.Canteen}</td>
                <td style={Styles.PrintTableBorder}>{item.Fines}</td>
                <td style={Styles.PrintTableBorder}>{item.Amenity}</td>
                <td style={Styles.PrintTableBorder}>{item.FoodSubsidy}</td>
                <td style={Styles.PrintTableBorder}>{item.PoorStuWelFund}</td>
                <td style={Styles.PrintTableBorder}>{item.McServantWelFund}</td>
                <td style={Styles.PrintTableBorder}>{item.CelebrationFund}</td>
                <td style={Styles.PrintTableBorderBold}>{item.Total}</td>
              </tr>
            ))}
            <tr key={dayCollection._id}>
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>{""}</td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.MessOne}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.MessTwo}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.Canteen}
              </td>
              <td style={Styles.PrintTableBorderBold}>{dayCollection.Fines}</td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.Amenity}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.FoodSubsidy}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.PoorStuWelFund}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.McServantWelFund}
              </td>
              <td style={Styles.PrintTableBorderBold}>
                {dayCollection.CelebrationFund}
              </td>
              <td style={Styles.PrintTableBorderBold}>{dayCollection.Total}</td>
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
      <div style={Styles.Middle}>
        <Loading />
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

import {
  Middle,
  PrintTableBorder,
  PrintTableBorderBold
} from "../../../modules/styles";
import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import { McDetail } from "./mc-detail.js";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";

const McDateDetails = ({
  history,
  details,
  dayCollection,
  client,
  refetch
}) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <table className="table table-condensed table-striped text-center">
          <tbody>
            <tr>
              <th colSpan="21" style={PrintTableBorder}>
                RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt
                Number &nbsp; M-1: Mess One &nbsp; M-2: Mess Two &nbsp; CNT:
                Canteen &nbsp; AMNT: Amenity &nbsp; FS: Food Subsidy
                <br />
                PSWF: Poor Student Welfare Fund &nbsp; MSWF: Mess Canteen
                Servant Welfare Fund &nbsp; CF: Celebration Fund
              </th>
            </tr>
            <tr style={{ fontSize: "larger" }}>
              <th style={PrintTableBorder}>RD</th>
              <th style={PrintTableBorder}>DD</th>
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
              <th colSpan={5} style={PrintTableBorderBold}>
                Actions
              </th>
            </tr>
            {details.map((item, index) => (
              <McDetail
                key={index}
                detail={item}
                history={history}
                client={client}
                fetchMcDetails={refetch}
              />
            ))}
            <tr key={dayCollection._id}>
              <td style={PrintTableBorderBold}>{""}</td>
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
              <td colSpan={5} style={PrintTableBorderBold}>
                {""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

McDateDetails.propTypes = {
  details: PropTypes.array.isRequired,
  dayCollection: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  refetch: PropTypes.func.isRequired
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
    <McDateDetails
      loading={props.loading}
      details={props.mcDateDetails.details}
      dayCollection={props.mcDateDetails.dayCollection}
      client={props.client}
      refetch={props.refetch}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  mcDateDetails: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
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
  props: ({ data: { loading, mcDateDetails, refetch } }) => ({
    loading,
    mcDateDetails,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      date: ownProps.match.params.date
    }
  })
})(withRouter(withApollo(FormatData)));

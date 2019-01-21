import { Link, withRouter } from "react-router-dom";
import {
  Middle,
  PaddingThreeCenterLargeBold,
  PaddingThreeLeft,
  PaddingThreeLeftBold,
  PrintTableBorder,
  PrintTableBorderBold,
  WidthTenPaddingThreeLeftBold,
  WidthThirteenPaddingThreeLeft,
  WidthTwentySevenPaddingThreeLeft
} from "../../../../modules/styles";
import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import { Loading } from "../../shared/Loading";
import { McDetail } from "../../mc-collections/mc-detail";
import { PaDetail } from "../../pa-collections/pa-detail";
import PropTypes from "prop-types";
import React from "react";
import { SaDetail } from "../../sa-collections/sa-detail";

const AdmissionDetails = props => {
  if (props.loading || !props.admissionDetails) {
    return (
      <div style={Middle}>
        <Loading />
      </div>
    );
  }
  return (
    <span>
      <div className="row">
        <div className="col-md-12">
          <table
            style={{
              marginBottom: "0"
            }}
            className="table table-bordered table-condensed table-striped"
          >
            <thead>
              <tr>
                <th style={PaddingThreeCenterLargeBold} colSpan="6">
                  {props.admissionDetails.resident.Name}
                  &nbsp; S/o {props.admissionDetails.resident.FatherName} &nbsp;
                  <Link to={`/resident/${props.admissionDetails.resident._id}`}>
                    <i className="fa fa-pencil-square-o" />
                  </Link>
                  <a
                    onClick={this.closeModal}
                    href=""
                    style={{ float: "right", marginRight: "10px" }}
                  >
                    <i className="fa fa-times fa-lg" aria-hidden="true" />
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={WidthTenPaddingThreeLeftBold}>Roll Number</td>
                <td style={WidthThirteenPaddingThreeLeft}>
                  {props.admissionDetails.resident.RollNumber}
                </td>
                <td style={WidthTenPaddingThreeLeftBold}>Tel Num</td>
                <td style={WidthTwentySevenPaddingThreeLeft}>
                  {props.admissionDetails.resident.TelephoneNumber}
                </td>
                <td style={WidthTenPaddingThreeLeftBold}>Category</td>
                <td style={WidthTwentySevenPaddingThreeLeft}>
                  {props.admissionDetails.resident.Category.Value}
                </td>
              </tr>
              <tr>
                <td style={PaddingThreeLeftBold}>Room</td>
                <td style={PaddingThreeLeft}>
                  {props.admissionDetails.resident.Room.Value}
                </td>
                <td style={PaddingThreeLeftBold}>Class</td>
                <td style={PaddingThreeLeft} colSpan="5">
                  {props.admissionDetails.resident.Class.Value}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <table className="table table-condensed table-striped text-center">
            <thead>
              <tr>
                <th colSpan="18" style={PrintTableBorder}>
                  RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt
                  Number &nbsp; RR: Room Rent &nbsp; WC: Water Charges &nbsp;
                  EC: Electricity Charges
                  <br />
                  DF: Development Fund &nbsp; RHMC: Routine Hostel Maintenance
                  Charges &nbsp; Misc: Miscellaneous &nbsp;
                </th>
              </tr>
              <tr>
                <th style={PrintTableBorder}>RD</th>
                <th style={PrintTableBorder}>DD</th>
                <th style={PrintTableBorder}>RNo</th>
                <th style={PrintTableBorder}>Room</th>
                <th style={PrintTableBorder}>Roll No.</th>
                <th style={PrintTableBorder}>Name</th>
                <th style={PrintTableBorder}>RR</th>
                <th style={PrintTableBorder}>WC</th>
                <th style={PrintTableBorder}>EC</th>
                <th style={PrintTableBorder}>DF</th>
                <th style={PrintTableBorder}>RHMC</th>
                <th style={PrintTableBorder}>Misc</th>
                <th style={PrintTableBorder}>Total</th>
                <th colSpan="5" style={PrintTableBorder}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {props.admissionDetails.paDetails.map((item, index) => (
                <PaDetail
                  key={index}
                  detail={item}
                  history={props.history}
                  client={props.client}
                  fetchPaDetails={props.refetch}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
              {props.admissionDetails.mcDetails.map((item, index) => (
                <McDetail
                  key={index}
                  detail={item}
                  history={props.history}
                  client={props.client}
                  fetchMcDetails={props.refetch}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <table className="table table-condensed table-striped text-center">
            <thead>
              <tr>
                <th colSpan="14" style={PrintTableBorder}>
                  RD: Receipt Date &nbsp; DD: Deposit Date &nbsp; RNo: Receipt
                  Number &nbsp; HS: Hostel Security &nbsp; MS: Mess Security
                  &nbsp; CS: Canteen Security
                </th>
              </tr>
              <tr>
                <th style={PrintTableBorder}>RD</th>
                <th style={PrintTableBorder}>DD</th>
                <th style={PrintTableBorder}>RNo</th>
                <th style={PrintTableBorder}>Room</th>
                <th style={PrintTableBorder}>Roll No.</th>
                <th style={PrintTableBorder}>Name</th>
                <th style={PrintTableBorder}>HS</th>
                <th style={PrintTableBorder}>MS</th>
                <th style={PrintTableBorder}>CS</th>
                <th style={PrintTableBorder}>Total</th>
                <th colSpan="4" style={PrintTableBorder}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {props.admissionDetails.saDetails.map((item, index) => (
                <SaDetail
                  key={index}
                  detail={item}
                  history={props.history}
                  client={props.client}
                  fetchSaDetails={props.refetch}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </span>
  );
};

AdmissionDetails.propTypes = {
  loading: PropTypes.bool.isRequired,
  admissionDetails: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

const ADMISSION_DETAILS = gql`
  query($resId: String!) {
    admissionDetails(resId: $resId)
  }
`;

export default graphql(ADMISSION_DETAILS, {
  props: ({ data: { loading, admissionDetails, refetch } }) => ({
    loading,
    admissionDetails,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      resId: ownProps.match.params.resId
    }
  })
})(withRouter(withApollo(AdmissionDetails)));

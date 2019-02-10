import "../../layouts/datepicker.css";

import { Middle, h4 } from "../../../modules/styles";
import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import DatePicker from "react-datepicker";
import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";

const UPDATE_MC_DETAIL = gql`
  mutation(
    $detId: ID!
    $receiptDate: String!
    $depositDate: String!
    $receiptNumber: String!
    $studentName: String!
    $roomNumber: String!
    $rollNumber: String!
    $monthName: String!
    $messOne: Int!
    $messTwo: Int!
    $canteen: Int!
    $fines: Int!
    $amenity: Int!
    $poorStuWelFund: Int!
    $mcServantWelFund: Int!
    $foodSubsidy: Int!
    $celebrationFund: Int!
  ) {
    updateMcDetail(
      detId: $detId
      receiptDate: $receiptDate
      depositDate: $depositDate
      receiptNumber: $receiptNumber
      studentName: $studentName
      roomNumber: $roomNumber
      rollNumber: $rollNumber
      monthName: $monthName
      messOne: $messOne
      messTwo: $messTwo
      canteen: $canteen
      fines: $fines
      amenity: $amenity
      poorStuWelFund: $poorStuWelFund
      mcServantWelFund: $mcServantWelFund
      foodSubsidy: $foodSubsidy
      celebrationFund: $celebrationFund
    )
  }
`;

const EDIT_MC_DETAIL = gql`
  query($detId: String!) {
    editMcDetail(detId: $detId)
  }
`;

const MC_DATE_DETAILS = gql`
  query($date: String!) {
    mcDateDetails(date: $date)
  }
`;

export class EditMcDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ReceiptDate: moment.utc(props.detail.ReceiptDate).toDate(),
      DepositDate: moment.utc(props.detail.DepositDate).toDate(),
      ReceiptNumber: props.detail.ReceiptNumber,
      StudentName: props.detail.StudentName,
      RoomNumber: props.detail.RoomNumber,
      RollNumber: props.detail.RollNumber,
      MonthName: props.detail.MonthName,
      MessOne: props.detail.MessOne,
      MessTwo: props.detail.MessTwo,
      Canteen: props.detail.Canteen,
      Fines: props.detail.Fines,
      Amenity: props.detail.Amenity,
      PoorStuWelFund: props.detail.PoorStuWelFund,
      McServantWelFund: props.detail.McServantWelFund,
      FoodSubsidy: props.detail.FoodSubsidy,
      CelebrationFund: props.detail.CelebrationFund
    };
    this.submitForm = this.submitForm.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.rcptChange = this.rcptChange.bind(this);
    this.deptChange = this.deptChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    const depositDate = this.state.DepositDate.format("DD-MM-YYYY");
    this.props.client
      .mutate({
        mutation: UPDATE_MC_DETAIL,
        variables: {
          depositDate,
          detId: this.props.detail._id,
          receiptDate: this.state.ReceiptDate.format("DD-MM-YYYY"),
          receiptNumber: this.state.ReceiptNumber,
          studentName: this.state.StudentName,
          roomNumber: this.state.RoomNumber,
          rollNumber: this.state.RollNumber,
          monthName: this.state.MonthName,
          messOne: this.state.MessOne,
          messTwo: this.state.MessTwo,
          canteen: this.state.Canteen,
          fines: this.state.Fines,
          amenity: this.state.Amenity,
          poorStuWelFund: this.state.PoorStuWelFund,
          mcServantWelFund: this.state.McServantWelFund,
          foodSubsidy: this.state.FoodSubsidy,
          celebrationFund: this.state.CelebrationFund
        }
      })
      .then(() => {
        this.props.client.resetStore().then(() => {
          this.props.client
            .query({
              query: MC_DATE_DETAILS,
              variables: {
                date: depositDate
              }
            })
            .then(() => {
              this.props.history.push(`/mc-date-details/${depositDate}`);
            })
            .catch(error => {
              console.log("Error:- MC_DATE_DETAILS", error);
            });
        });
      })
      .catch(error => {
        console.log("Error:- UPDATE_MC_DETAIL", error);
      });
  }

  rcptChange(date) {
    this.setState({ ReceiptDate: date });
  }

  deptChange(date) {
    this.setState({ DepositDate: date });
  }

  keyPressed(event) {
    if (event.key === "Enter") {
      this.submitForm(event);
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <table className="table table-bordered table-condensed table-striped text-center">
            <thead>
              <tr>
                <th colSpan="2">
                  <h4 style={h4}>Edit Mess Canteen Detail</h4>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="text-center width-fifty">Receipt Date</th>
                <td
                  style={{
                    paddingLeft: 51,
                    paddingRight: 51
                  }}
                  className="text-center"
                >
                  <DatePicker
                    autoFocus
                    tabIndex={1}
                    dateFormat="DD-MM-YYYY"
                    selected={this.state.ReceiptDate}
                    onChange={this.rcptChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center width-fifty">Deposit Date</th>
                <td
                  style={{
                    paddingLeft: 51,
                    paddingRight: 51
                  }}
                  className="text-center"
                >
                  <DatePicker
                    tabIndex={1}
                    dateFormat="DD-MM-YYYY"
                    selected={this.state.DepositDate}
                    onChange={this.deptChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center width-fifty">Receipt Number</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="ReceiptNumber"
                    defaultValue={this.state.ReceiptNumber}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Student Name</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="StudentName"
                    defaultValue={this.state.StudentName}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Room Number</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="RoomNumber"
                    defaultValue={this.state.RoomNumber}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Roll Number</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="RollNumber"
                    defaultValue={this.state.RollNumber}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Month Name</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="MonthName"
                    defaultValue={this.state.MonthName}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Mess One</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="MessOne"
                    defaultValue={this.state.MessOne}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Mess Two</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="MessTwo"
                    defaultValue={this.state.MessTwo}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Canteen</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="Canteen"
                    defaultValue={this.state.Canteen}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Fines</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="Fines"
                    defaultValue={this.state.Fines}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Amenity</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="Amenity"
                    defaultValue={this.state.Amenity}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Poor Stu Wel Fund</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="PoorStuWelFund"
                    defaultValue={this.state.PoorStuWelFund}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Mc Servant Wel Fund</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="McServantWelFund"
                    defaultValue={this.state.McServantWelFund}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Food Subsidy</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="FoodSubsidy"
                    defaultValue={this.state.FoodSubsidy}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Celebration Fund</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="CelebrationFund"
                    defaultValue={this.state.CelebrationFund}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center" colSpan="2">
                  <a id="save-form" onClick={this.submitForm} href="">
                    Save
                  </a>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

EditMcDetail.propTypes = {
  loading: PropTypes.bool.isRequired,
  detail: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
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
    <EditMcDetail
      loading={props.loading}
      detail={props.editMcDetail}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  editMcDetail: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  editMcDetail: {}
};

export default graphql(EDIT_MC_DETAIL, {
  props: ({ data: { loading, editMcDetail, refetch } }) => ({
    loading,
    editMcDetail,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      detId: ownProps.match.params.detId
    }
  })
})(withRouter(withApollo(FormatData)));

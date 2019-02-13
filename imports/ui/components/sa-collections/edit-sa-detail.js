import { Middle, h4 } from "../../../modules/styles";
import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import DatePicker from "react-datepicker";
import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";

const UPDATE_SA_DETAIL = gql`
  mutation(
    $detId: ID!
    $receiptDate: String!
    $depositDate: String!
    $receiptNumber: Int!
    $studentName: String!
    $roomNumber: String!
    $rollNumber: String!
    $hostelSecurity: Int!
    $messSecurity: Int!
    $canteenSecurity: Int!
  ) {
    updateSaDetail(
      detId: $detId
      receiptDate: $receiptDate
      depositDate: $depositDate
      receiptNumber: $receiptNumber
      studentName: $studentName
      roomNumber: $roomNumber
      rollNumber: $rollNumber
      hostelSecurity: $hostelSecurity
      messSecurity: $messSecurity
      canteenSecurity: $canteenSecurity
    )
  }
`;

const EDIT_SA_DETAIL = gql`
  query($detId: String!) {
    editSaDetail(detId: $detId)
  }
`;

const SA_DATE_DETAILS = gql`
  query($date: String!) {
    saDateDetails(date: $date)
  }
`;

export class EditSaDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ReceiptDate: moment.utc(props.detail.ReceiptDate).toDate(),
      DepositDate: moment.utc(props.detail.DepositDate).toDate(),
      ReceiptNumber: props.detail.ReceiptNumber,
      StudentName: props.detail.StudentName,
      CanteenSecurity: props.detail.CanteenSecurity,
      MessSecurity: props.detail.MessSecurity,
      HostelSecurity: props.detail.HostelSecurity,
      RollNumber: props.detail.RollNumber,
      RoomNumber: props.detail.RoomNumber
    };
    this.submitForm = this.submitForm.bind(this);
    this.rcptChange = this.rcptChange.bind(this);
    this.deptChange = this.deptChange.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    const depositDate = this.state.DepositDate.format("DD-MM-YYYY");
    this.props.client
      .mutate({
        mutation: UPDATE_SA_DETAIL,
        variables: {
          depositDate,
          detId: this.props.detail._id,
          receiptDate: this.state.ReceiptDate.format("DD-MM-YYYY"),
          receiptNumber: this.state.ReceiptNumber,
          studentName: this.state.StudentName,
          roomNumber: this.state.RoomNumber,
          rollNumber: this.state.RollNumber,
          hostelSecurity: this.state.HostelSecurity,
          messSecurity: this.state.MessSecurity,
          canteenSecurity: this.state.CanteenSecurity
        }
      })
      .then(() => {
        this.props.client.resetStore().then(() => {
          this.props.client
            .query({
              query: SA_DATE_DETAILS,
              variables: {
                date: depositDate
              }
            })
            .then(() => {
              this.props.history.push(`/sa-date-details/${depositDate}`);
            });
        });
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
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
                  <h4 style={h4}>Edit Security Account Detail</h4>
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
                    name="RcptDate"
                    tabIndex={-1}
                    dateFormat="dd-MM-yyyy"
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
                    tabIndex={-1}
                    dateFormat="dd-MM-yyyy"
                    name="DeptDate"
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
                <th className="text-center">Hostel Security</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="HostelSecurity"
                    defaultValue={this.state.HostelSecurity}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Mess Security</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="MessSecurity"
                    defaultValue={this.state.MessSecurity}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Canteen Security</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    name="CanteenSecurity"
                    defaultValue={this.state.CanteenSecurity}
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

EditSaDetail.propTypes = {
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
    <EditSaDetail
      loading={props.loading}
      detail={props.editSaDetail}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  editSaDetail: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  editSaDetail: {}
};

export default graphql(EDIT_SA_DETAIL, {
  props: ({ data: { loading, editSaDetail, refetch } }) => ({
    loading,
    editSaDetail,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      detId: ownProps.match.params.detId
    }
  })
})(withRouter(withApollo(FormatData)));

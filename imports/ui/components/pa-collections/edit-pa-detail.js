import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { graphql, withApollo } from "react-apollo";
import DatePicker from "react-datepicker";
import MDSpinner from "react-md-spinner";
import { withRouter } from "react-router-dom";
import { h4, Middle } from "../../../modules/styles";
import "../../layouts/datepicker.css";

const UPDATE_PA_DETAIL = gql`
  mutation(
    $detId: ID!
    $receiptDate: String!
    $depositDate: String!
    $receiptNumber: String!
    $name: String!
    $roomNumber: String!
    $rollNumber: String!
    $roomRent: Int!
    $waterCharges: Int!
    $electricityCharges: Int!
    $developmentFund: Int!
    $rutineHstlMaintnceCharges: Int!
    $miscellaneous: Int!
  ) {
    updatePaDetail(
      detId: $detId
      receiptDate: $receiptDate
      depositDate: $depositDate
      receiptNumber: $receiptNumber
      name: $name
      roomNumber: $roomNumber
      rollNumber: $rollNumber
      roomRent: $roomRent
      waterCharges: $waterCharges
      electricityCharges: $electricityCharges
      developmentFund: $developmentFund
      rutineHstlMaintnceCharges: $rutineHstlMaintnceCharges
      miscellaneous: $miscellaneous
    )
  }
`;

const EDIT_PA_DETAIL = gql`
  query($detId: String!) {
    editPaDetail(detId: $detId)
  }
`;

const PA_DATE_DETAILS = gql`
  query($date: String!) {
    paDateDetails(date: $date)
  }
`;

export class EditPaDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ReceiptDate: moment(props.detail.ReceiptDate).toDate(),
      DepositDate: moment(props.detail.DepositDate).toDate(),
      ReceiptNumber: props.detail.ReceiptNumber,
      Name: props.detail.Name,
      RoomNumber: props.detail.RoomNumber,
      RollNumber: props.detail.RollNumber,
      RoomRent: props.detail.RoomRent,
      WaterCharges: props.detail.WaterCharges,
      ElectricityCharges: props.detail.ElectricityCharges,
      DevelopmentFund: props.detail.DevelopmentFund,
      RutineHstlMaintnceCharges: props.detail.RutineHstlMaintnceCharges,
      Miscellaneous: props.detail.Miscellaneous
    };
    this.submitForm = this.submitForm.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.rcptChange = this.rcptChange.bind(this);
    this.deptChange = this.deptChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    const depositDate = moment.utc(this.state.DepositDate).format("DD-MM-YYYY");
    const receiptDate = moment.utc(this.state.ReceiptDate).format("DD-MM-YYYY");
    this.props.client
      .mutate({
        mutation: UPDATE_PA_DETAIL,
        variables: {
          depositDate,
          detId: this.props.detail._id,
          receiptDate,
          receiptNumber: this.state.ReceiptNumber,
          name: this.state.Name,
          roomNumber: this.state.RoomNumber,
          rollNumber: this.state.RollNumber,
          roomRent: this.state.RoomRent,
          waterCharges: this.state.WaterCharges,
          electricityCharges: this.state.ElectricityCharges,
          developmentFund: this.state.DevelopmentFund,
          rutineHstlMaintnceCharges: this.state.RutineHstlMaintnceCharges,
          miscellaneous: this.state.Miscellaneous
        }
      })
      .then(() => {
        this.props.client.resetStore().then(() => {
          this.props.client
            .query({
              query: PA_DATE_DETAILS,
              variables: {
                date: depositDate
              }
            })
            .then(() => {
              this.props.history.push(`/pa-date-details/${depositDate}`);
            })
            .catch(error => {
              console.log("Error:- PA_DATE_DETAILS", error);
            });
        });
      })
      .catch(error => {
        console.log("Error:- UPDATE_PA_DETAIL", error);
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

  handleChange({ target }) {
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
                  <h4 style={h4}>Edit Private Account Detail</h4>
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
                    tabIndex={-1}
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
                    tabIndex="-1"
                    name="Name"
                    defaultValue={this.state.Name}
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
                    tabIndex="-1"
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
                    tabIndex="-1"
                    name="RollNumber"
                    defaultValue={this.state.RollNumber}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Room Rent</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="0"
                    name="RoomRent"
                    defaultValue={this.state.RoomRent}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Water Charges</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="0"
                    name="WaterCharges"
                    defaultValue={this.state.WaterCharges}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Electricity Charges</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="0"
                    name="ElectricityCharges"
                    defaultValue={this.state.ElectricityCharges}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Miscellaneous</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="0"
                    name="Miscellaneous"
                    defaultValue={this.state.Miscellaneous}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Development Fund</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="0"
                    name="DevelopmentFund"
                    defaultValue={this.state.DevelopmentFund}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center">Rutine Hstl Maintnce Charges</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="0"
                    name="RutineHstlMaintnceCharges"
                    defaultValue={this.state.RutineHstlMaintnceCharges}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center" colSpan="2">
                  <a tabIndex="0" id="save-form" onClick={this.submitForm} href="">
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

EditPaDetail.propTypes = {
  detail: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
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
    <EditPaDetail
      loading={props.loading}
      detail={props.editPaDetail}
      refetch={props.refetch}
      client={props.client}
      history={props.history}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  editPaDetail: PropTypes.object,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
};

FormatData.defaultProps = {
  editPaDetail: {}
};

export default graphql(EDIT_PA_DETAIL, {
  props: ({ data: { loading, editPaDetail, refetch } }) => ({
    loading,
    editPaDetail,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      detId: ownProps.match.params.detId
    }
  })
})(withRouter(withApollo(FormatData)));

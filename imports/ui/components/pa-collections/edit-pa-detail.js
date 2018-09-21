import * as Styles from "../../../modules/styles";

import { gql, graphql, withApollo } from "react-apollo";

import ApolloClient from "apollo-client";
import DatePicker from "react-datepicker";
import { Loading } from "/imports/ui/components/shared/Loading.js";
import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";

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

export class EditPaDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ReceiptDate: moment.utc(props.detail.ReceiptDate),
      DepositDate: moment.utc(props.detail.DepositDate),
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
    const depositDate = this.state.DepositDate.format("DD-MM-YYYY");
    this.props.client
      .mutate({
        mutation: UPDATE_PA_DETAIL,
        variables: {
          depositDate,
          detId: this.props.detail._id,
          receiptDate: this.state.ReceiptDate.format("DD-MM-YYYY"),
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
        this.props.client.resetStore();
        this.props.history.push(`/pa-date-details/${depositDate}`);
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
                <th colSpan="2" className="text-center h4">
                  Edit Private Account Detail
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
                <th className="text-center">Room Rent</th>
                <td className="text-center">
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="10"
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
                    tabIndex="10"
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
                    tabIndex="10"
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
                    tabIndex="10"
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
                    tabIndex="10"
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
                    tabIndex="10"
                    name="RutineHstlMaintnceCharges"
                    defaultValue={this.state.RutineHstlMaintnceCharges}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center" colSpan="2">
                  <a
                    tabIndex="10"
                    id="save-form"
                    onClick={this.submitForm}
                    href=""
                  >
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
  loading: PropTypes.bool.isRequired,
  detail: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
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
  editPaDetail: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
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

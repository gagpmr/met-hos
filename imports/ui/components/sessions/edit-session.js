import { Middle, paddingThree } from "../../../modules/styles";
import { graphql, withApollo } from "react-apollo";

import $ from "jquery";
import ApolloClient from "apollo-client";
import MDSpinner from "react-md-spinner";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";

const UPDATE_SESSION = gql`
  mutation(
    $sessId: ID!
    $srNo: Int!
    $isCurrentSession: Boolean!
    $value: String!
    $suffix: String!
    $hostelSecurity: Int!
    $messSecurity: Int!
    $canteenSecurity: Int!
    $totalSecurity: Int!
    $messAmenity: Int!
    $canteenAmenity: Int!
    $poorStuWelFund: Int!
    $mcServantWelFund: Int!
    $celebrationFund: Int!
    $rutineHstlMaintnceCharges: Int!
    $developmentFund: Int!
    $continuationCharges: Int!
    $dailyCharges: Int!
    $roomRent: Int!
    $waterCharges: Int!
    $foodSubsidy: Int!
    $electricityCharges: Int!
  ) {
    updateSession(
      sessId: $sessId
      srNo: $srNo
      isCurrentSession: $isCurrentSession
      value: $value
      suffix: $suffix
      hostelSecurity: $hostelSecurity
      messSecurity: $messSecurity
      canteenSecurity: $canteenSecurity
      totalSecurity: $totalSecurity
      messAmenity: $messAmenity
      canteenAmenity: $canteenAmenity
      poorStuWelFund: $poorStuWelFund
      mcServantWelFund: $mcServantWelFund
      celebrationFund: $celebrationFund
      rutineHstlMaintnceCharges: $rutineHstlMaintnceCharges
      developmentFund: $developmentFund
      continuationCharges: $continuationCharges
      dailyCharges: $dailyCharges
      roomRent: $roomRent
      waterCharges: $waterCharges
      foodSubsidy: $foodSubsidy
      electricityCharges: $electricityCharges
    )
  }
`;

export class EditSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = null;
    this.submitForm = this.submitForm.bind(this);
    this.alter = this.alter.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    const checked = $("#IsCurrentSession").is(":checked");
    this.props.client
      .mutate({
        mutation: UPDATE_SESSION,
        variables: {
          sessId: this.props.session._id,
          srNo: $("#SrNo").val(),
          isCurrentSession: checked,
          value: $("#Value").val(),
          suffix: $("#Suffix").val(),
          hostelSecurity: $("#HostelSecurity").val(),
          messSecurity: $("#MessSecurity").val(),
          canteenSecurity: $("#CanteenSecurity").val(),
          totalSecurity: $("#TotalSecurity").val(),
          messAmenity: $("#MessAmenity").val(),
          canteenAmenity: $("#CanteenAmenity").val(),
          poorStuWelFund: $("#PoorStuWelFund").val(),
          mcServantWelFund: $("#McServantWelFund").val(),
          celebrationFund: $("#CelebrationFund").val(),
          rutineHstlMaintnceCharges: $("#RutineHstlMaintnceCharges").val(),
          developmentFund: $("#DevelopmentFund").val(),
          continuationCharges: $("#ContinuationCharges").val(),
          dailyCharges: $("#DailyCharges").val(),
          roomRent: $("#RoomRent").val(),
          waterCharges: $("#WaterCharges").val(),
          foodSubsidy: $("#FoodSubsidy").val(),
          electricityCharges: $("#ElectricityCharges").val()
        }
      })
      .then(() => {
        this.props.client.resetStore();
        this.props.history.push(`/sessions`);
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  keyPressed(event) {
    if (event.key === "Enter") {
      this.submitForm(event);
    }
  }

  alter(event) {
    if (event.target.checked) {
      this.setState({
        iscurrent: true
      });
    }
    if (!event.target.checked) {
      this.setState({
        iscurrent: false
      });
    }
  }

  render() {
    let iscurrent = [];
    if (this.state === null) {
      if (this.props.session.IsCurrentSession) {
        iscurrent.push(
          <td key={1} style={paddingThree}>
            <input type="checkbox" tabIndex="1" onChange={this.alter} id="IsCurrentSession" defaultChecked />
            &nbsp; True
          </td>
        );
      } else {
        iscurrent.push(
          <td key={2} style={paddingThree}>
            <input type="checkbox" tabIndex="1" onChange={this.alter} id="IsCurrentSession" />
            &nbsp; False
          </td>
        );
      }
    } else {
      if (this.state.iscurrent) {
        iscurrent.push(
          <td key={1} style={paddingThree}>
            <input type="checkbox" tabIndex="1" onChange={this.alter} id="IsCurrentSession" defaultChecked />
            &nbsp; True
          </td>
        );
      } else {
        iscurrent.push(
          <td key={2} style={paddingThree}>
            <input type="checkbox" tabIndex="1" onChange={this.alter} id="IsCurrentSession" />
            &nbsp; False
          </td>
        );
      }
    }
    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <table className="table table-bordered table-condensed table-striped text-center">
            <thead>
              <tr>
                <th colSpan="2" className="text-center h4">
                  Edit Session
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={paddingThree} className="width-sixty-five">
                  Value
                </th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="Value"
                    defaultValue={this.props.session.Value}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Serial Number</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="SrNo"
                    defaultValue={this.props.session.SrNo}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Is Current Session</th>
                {iscurrent}
              </tr>
              <tr>
                <th style={paddingThree}>Suffix</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="Suffix"
                    defaultValue={this.props.session.Suffix}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Room Rent</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="RoomRent"
                    defaultValue={this.props.session.RoomRent}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Water Charges</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="WaterCharges"
                    defaultValue={this.props.session.WaterCharges}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Electricity Charges</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="ElectricityCharges"
                    defaultValue={this.props.session.ElectricityCharges}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Hostel Security</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="HostelSecurity"
                    defaultValue={this.props.session.HostelSecurity}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Mess Security</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="MessSecurity"
                    defaultValue={this.props.session.MessSecurity}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Canteen Security</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="CanteenSecurity"
                    defaultValue={this.props.session.CanteenSecurity}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Total Security</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="TotalSecurity"
                    defaultValue={this.props.session.TotalSecurity}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Mess Amenity</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="MessAmenity"
                    defaultValue={this.props.session.MessAmenity}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Canteen Amenity</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="CanteenAmenity"
                    defaultValue={this.props.session.CanteenAmenity}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Food Subsidy</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="FoodSubsidy"
                    defaultValue={this.props.session.FoodSubsidy}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Poor Student Welfare Fund</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="PoorStuWelFund"
                    defaultValue={this.props.session.PoorStuWelFund}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Mess Canteen Servant Welfare Fund</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="McServantWelFund"
                    defaultValue={this.props.session.McServantWelFund}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Celebration Fund</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="CelebrationFund"
                    defaultValue={this.props.session.CelebrationFund}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Development Fund</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="DevelopmentFund"
                    defaultValue={this.props.session.DevelopmentFund}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Routine Hostel Maintenance Charges</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="RutineHstlMaintnceCharges"
                    defaultValue={this.props.session.RutineHstlMaintnceCharges}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Continuation Charges</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="ContinuationCharges"
                    defaultValue={this.props.session.ContinuationCharges}
                  />
                </td>
              </tr>
              <tr>
                <th style={paddingThree}>Daily Charges</th>
                <td style={paddingThree}>
                  <input
                    onKeyDown={this.keyPressed}
                    type="text"
                    tabIndex="1"
                    id="DailyCharges"
                    defaultValue={this.props.session.DailyCharges}
                  />
                </td>
              </tr>
              <tr>
                <th className="text-center" colSpan="2">
                  <a tabIndex="1" id="save-form" onClick={this.submitForm} href="">
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

EditSession.propTypes = {
  session: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
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
    <EditSession
      loading={props.loading}
      session={props.editSession}
      client={props.client}
      history={props.history}
      refetch={props.refetch}
    />
  );
};

FormatData.propTypes = {
  loading: PropTypes.bool.isRequired,
  editSession: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

FormatData.defaultProps = {
  session: {}
};

const EDIT_SESSION = gql`
  query($sessId: String!) {
    editSession(sessId: $sessId)
  }
`;

export default graphql(EDIT_SESSION, {
  props: ({ data: { loading, editSession, refetch } }) => ({
    loading,
    editSession,
    refetch
  }),
  forceFetch: true,
  options: ownProps => ({
    variables: {
      sessId: ownProps.match.params.sessId
    }
  })
})(withRouter(withApollo(FormatData)));

import { h4, widthSixtyFive } from "../../../modules/styles";

import ApolloClient from "apollo-client";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { gql } from "react-apollo";

const EDIT_SESSION = gql`
  query($sessId: String!) {
    editSession(sessId: $sessId)
  }
`;

const COPY_EDIT_SESSION = gql`
  mutation($sessId: String!) {
    copyEditSession(sessId: $sessId)
  }
`;

const REMOVE_SESSION = gql`
  mutation($sessId: String!) {
    removeSession(sessId: $sessId)
  }
`;

export class Session extends React.Component {
  constructor(props) {
    super(props);
    this.copyEdit = this.copyEdit.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    if (this.props !== undefined) {
      if (this.props.session.Focus) {
        ReactDOM.findDOMNode(
          this.refs[this.props.session._id]
        ).scrollIntoView();
      }
    }
  }

  copyEdit(event) {
    event.preventDefault();
    this.props.client
      .mutate({
        mutation: COPY_EDIT_SESSION,
        variables: {
          sessId: this.props.session._id
        }
      })
      .then(({ data }) => {
        this.props.client.query({
          query: EDIT_SESSION,
          variables: {
            sessId: data.copyEditSession
          }
        });
        this.props.history.push(`/edit-session/${data.copyEditSession}`);
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  remove(e) {
    e.preventDefault();
    this.props.client
      .mutate({
        mutation: REMOVE_SESSION,
        variables: {
          sessId: this.props.session._id
        }
      })
      .then(() => {
        this.props.client.resetStore();
      });
  }

  render() {
    const topRows = [];
    const bottomRows = [];
    if (this.props.session !== undefined) {
      topRows.push(
        <tr key={1} className="text-left bold-black">
          <td style={widthSixtyFive}>Serial Number</td>
          <td>
            <strong>{this.props.session.SrNo}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={2} className="text-left bold-black">
          <td style={widthSixtyFive}>Is Current Session</td>
          <td>
            <strong>{this.props.session.IsCurrentSession.toString()}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={3} className="text-left bold-black">
          <td style={widthSixtyFive}>Suffix</td>
          <td>
            <strong>{this.props.session.Suffix}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={4} className="text-left bold-black">
          <td style={widthSixtyFive}>Room Rent</td>
          <td>
            <strong>{this.props.session.RoomRent}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={5} className="text-left bold-black">
          <td style={widthSixtyFive}>Water Charges</td>
          <td>
            <strong>{this.props.session.WaterCharges}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={7} className="text-left bold-black">
          <td style={widthSixtyFive}>Electricity Charges</td>
          <td>
            <strong>{this.props.session.ElectricityCharges}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={8} className="text-left bold-black">
          <td style={widthSixtyFive}>Hostel Security</td>
          <td>
            <strong>{this.props.session.HostelSecurity}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={9} className="text-left bold-black">
          <td style={widthSixtyFive}>Mess Security</td>
          <td>
            <strong>{this.props.session.MessSecurity}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={10} className="text-left bold-black">
          <td style={widthSixtyFive}>Canteen Security</td>
          <td>
            <strong>{this.props.session.CanteenSecurity}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={11} className="text-left bold-black">
          <td style={widthSixtyFive}>Total Security</td>
          <td>
            <strong>{this.props.session.TotalSecurity}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={12} className="text-left bold-black">
          <td style={widthSixtyFive}>Mess Amenity</td>
          <td>
            <strong>{this.props.session.MessAmenity}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={13} className="text-left bold-black">
          <td style={widthSixtyFive}>Canteen Amenity</td>
          <td>
            <strong>{this.props.session.CanteenAmenity}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={6} className="text-left bold-black">
          <td style={widthSixtyFive}>Food Subsidy</td>
          <td>
            <strong>{this.props.session.FoodSubsidy}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={15} className="text-left bold-black">
          <td style={widthSixtyFive}>Poor Student Welfare Fund</td>
          <td>
            <strong>{this.props.session.PoorStuWelFund}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={16} className="text-left bold-black">
          <td style={widthSixtyFive}>Mess Canteen Servant Welfare Fund</td>
          <td>
            <strong>{this.props.session.McServantWelFund}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={18} className="text-left bold-black">
          <td style={widthSixtyFive}>Celebration Fund</td>
          <td>
            <strong>{this.props.session.CelebrationFund}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={19} className="text-left bold-black">
          <td style={widthSixtyFive}>Development Fund</td>
          <td>
            <strong>{this.props.session.DevelopmentFund}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={20} className="text-left bold-black">
          <td style={widthSixtyFive}>Routine Hostel Maintenance Charges</td>
          <td>
            <strong>{this.props.session.RutineHstlMaintnceCharges}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={22} className="text-left bold-black">
          <td style={widthSixtyFive}>Continuation Charges</td>
          <td>
            <strong>{this.props.session.ContinuationCharges}</strong>
          </td>
        </tr>
      );
      topRows.push(
        <tr key={23} className="text-left bold-black">
          <td style={widthSixtyFive}>Daily Charges</td>
          <td>
            <strong>{this.props.session.DailyCharges}</strong>
          </td>
        </tr>
      );
      bottomRows.push(
        <tr key={24}>
          <th colSpan="3" className="text-center">
            <a
              id="copy-edit"
              onClick={this.copyEdit}
              data-date={this.props.session.DepositDate}
              data-rnum={this.props.session.ReceiptNumber}
              data-detailid={this.props.session._id}
              href=""
            >
              Copy & Edit
            </a>
          </th>
        </tr>
      );
      bottomRows.push(
        <tr key={25}>
          <th colSpan="3" className="text-center">
            <Link to={`/edit-session/${this.props.session._id}`}>Edit</Link>
          </th>
        </tr>
      );
      bottomRows.push(
        <tr key={26}>
          <th colSpan="3" className="text-center">
            <a id="remove-session" onClick={this.remove} href="">
              Delete
            </a>
          </th>
        </tr>
      );
    }
    return (
      <table
        ref={this.props.session._id}
        className="table table-bordered table-condensed table-striped text-center"
      >
        <thead>
          <tr>
            <th colSpan="3">
              <h4 style={h4}>Session: {this.props.session.Value}</h4>
            </th>
          </tr>
        </thead>
        <tbody>
          {topRows}
          {bottomRows}
        </tbody>
      </table>
    );
  }
}

Session.propTypes = {
  session: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient),
  fetchSessions: PropTypes.func.isRequired
};

import "../../../../../layouts/datepicker.css";

import ApolloClient from "apollo-client";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import React from "react";
import gqls from "./sharedGqls";
import moment from "moment";

class Daily extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      StartDate: moment(props.bill.StartDate),
      EndDate: moment(props.bill.EndDate),
      Modified: false
    };
    this.keyPressed = this.keyPressed.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.changeStartDate = this.changeStartDate.bind(this);
    this.changeEndDate = this.changeEndDate.bind(this);
  }

  keyPressed(event) {
    if (event.key === "Enter") {
      this.submitForm(event);
    }
  }

  submitForm(e) {
    e.preventDefault();
    if (this.props.resident && this.props.bill) {
      this.props.client
        .mutate({
          mutation: gqls.updatePaBill,
          variables: {
            billType: "daily",
            resId: this.props.resident._id,
            billId: this.props.bill._id,
            startDate: this.state.StartDate.format("DD-MM-YYYY"),
            endDate: this.state.EndDate.format("DD-MM-YYYY"),
            electricity: 0,
            billPeriod: "",
            misc: 0,
            roomRent: 0,
            security: 0,
            halfYearly: 0
          }
        })
        .then(() => {
          if (this.state.Modified) {
            this.props.client.resetStore().then(() => {
              this.props.client
                .query({
                  query: gqls.residentDetails,
                  variables: {
                    id: this.props.resident._id
                  }
                })
                .then(() => {
                  this.props.history.push(
                    `/resident-details/${this.props.resident._id}`
                  );
                })
                .catch(error => {
                  console.log("Error:- NIGHT_STAY", error);
                });
            });
          }
        })
        .catch(error => {
          console.log("there was an error sending the query", error);
        });
    }
  }

  changeStartDate(date) {
    this.setState({ StartDate: date });
    this.setState({ Modified: true });
  }

  changeEndDate(date) {
    this.setState({ EndDate: date });
    this.setState({ Modified: true });
  }

  render() {
    return (
      <tbody>
        <tr>
          <th>Start Date</th>
          <td>
            <DatePicker
              autoFocus
              tabIndex={-1}
              dateFormat="dd-MM-yyyy"
              selected={this.state.StartDate}
              onChange={this.changeStartDate}
            />
          </td>
        </tr>
        <tr>
          <th>End Date</th>
          <td>
            <DatePicker
              tabIndex={-1}
              dateFormat="dd-MM-yyyy"
              selected={this.state.EndDate}
              onChange={this.changeEndDate}
            />
          </td>
        </tr>
        <tr>
          <th className="text-center" colSpan="2">
            <a onClick={this.submitForm} onKeyDown={this.keyPressed} href="">
              Save
            </a>
          </th>
        </tr>
      </tbody>
    );
  }
}

Daily.propTypes = {
  bill: PropTypes.object,
  resident: PropTypes.object,
  history: PropTypes.object.isRequired,
  client: PropTypes.instanceOf(ApolloClient)
};

export default Daily;
